"""Check that choosing a quiz option immediately answers and survives reload."""

import os
import socket
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright


APP = Path(__file__).resolve().parents[2] / "apps" / "InvestMaster"


with socket.socket() as listener:
    listener.bind(("127.0.0.1", 0))
    port = listener.getsockname()[1]

with tempfile.TemporaryDirectory(prefix="invest-master-quiz-") as work:
    env = os.environ.copy()
    env["PORT"] = str(port)
    env["INVEST_MASTER_DB"] = str(Path(work) / "state.sqlite")
    process = subprocess.Popen(
        ["node", "server/start.js"],
        cwd=APP,
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
    )
    try:
        base = f"http://127.0.0.1:{port}"
        for _ in range(80):
            try:
                with urlopen(f"{base}/invest-master/api/health", timeout=1):
                    break
            except Exception:
                time.sleep(0.1)
        else:
            raise RuntimeError("Invest Master test server did not start")

        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1280, "height": 900})
            content = page.request.get(f"{base}/invest-master/api/content").json()["items"]
            lesson = next(item for item in content if item["id"] == "bayesian-investment-evidence")
            question = lesson["quiz"][0]
            wrong = next(i for i in range(len(question["options"])) if i != question["answer"])
            page.goto(f"{base}/#/app/invest-master/read/{lesson['id']}", wait_until="networkidle")
            quiz = page.locator(".im-quiz-question").first
            expect(quiz.locator(".im-quiz-feedback")).to_have_count(0)
            assert page.get_by_role("button", name="提交答案").count() == 0

            wrong_option = quiz.locator(".im-quiz-options button").filter(has_text=question["options"][wrong])
            right_option = quiz.locator(".im-quiz-options button").filter(has_text=question["options"][question["answer"]])
            wrong_option.click()
            expect(quiz.locator(".im-quiz-feedback.no")).to_be_visible()
            expect(quiz.locator(".im-quiz-feedback p")).to_have_text(question["explanation"])
            expect(wrong_option).to_have_attribute("aria-pressed", "true")

            right_option.click()
            expect(quiz.locator(".im-quiz-feedback.yes")).to_be_visible()
            page.reload(wait_until="networkidle")
            quiz = page.locator(".im-quiz-question").first
            expect(quiz.locator(".im-quiz-feedback.yes")).to_be_visible()
            expect(quiz.locator(".im-quiz-options button").filter(has_text=question["options"][question["answer"]])).to_have_attribute("aria-pressed", "true")
            assert page.get_by_role("button", name="提交答案").count() == 0

            all_first = next(item for item in content if item["id"] == "capital-budgeting-npv-irr")
            page.goto(f"{base}/#/app/invest-master/read/{all_first['id']}", wait_until="networkidle")
            answer_positions = []
            for i, item in enumerate(all_first["quiz"]):
                labels = page.locator(".im-quiz-question").nth(i).locator(".im-quiz-options button").all_inner_texts()
                answer_positions.append(next(j for j, label in enumerate(labels) if item["options"][item["answer"]] in label))
            assert len(set(answer_positions)) > 1, answer_positions

            # The more demanding master-route questions use the same one-click flow.
            for lesson_id, marker in (
                ("damodaran-story-to-numbers", "13.75"),
                ("bogle-market-arithmetic", "1,000"),
                ("fisher-valuation-discipline", "259.2"),
                ("capstone-client-ips-stress", "34.29"),
                ("fund-etf-investor-rights", "101.8"),
                ("probability-and-evidence", "2.375"),
                ("yield-curve-call-risk", "101.84"),
                ("swensen-policy-allocation", "834"),
                ("swensen-commitment-liquidity", "48.8%"),
                ("swensen-manager-net-return", "13.2"),
                ("swensen-original-2009-review", "−24.6%"),
                ("working-capital-accounting", "88.72"),
                ("credit-pd-lgd-scenarios", "17.938%"),
                ("entrusted-capital-mandate", "15.8 万"),
                ("backtest-regression-evidence", "99.41%"),
                ("capstone-three-statement-equity", "171.38"),
                ("capstone-bond-credit-memo", "92.38"),
                ("integrated-research-capstone", "5.2%"),
                ("time-value-and-returns", "−7.29%"),
                ("bond-pricing-duration", "5.86%"),
                ("client-ips-loss-budget", "91.8%"),
                ("portfolio-policy-risk", "75.8 万"),
                ("revenue-recognition-contracts", "347.5 万元"),
                ("consolidation-minority-interest", "750"),
                ("accounting-quality", "160 万元"),
            ):
                lesson = next(item for item in content if item["id"] == lesson_id)
                question = lesson["quiz"][-1]
                page.set_viewport_size({"width": 390, "height": 844})
                page.goto(f"{base}/#/app/invest-master/read/{lesson_id}", wait_until="networkidle")
                expect(page.locator(".im-prose").first).to_contain_text(marker)
                assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), lesson_id
                quiz = page.locator(".im-quiz-question").last
                quiz.locator(".im-quiz-options button").filter(
                    has_text=question["options"][question["answer"]]
                ).click()
                expect(quiz.locator(".im-quiz-feedback.yes p")).to_have_text(question["explanation"])
                assert page.get_by_role("button", name="提交答案").count() == 0

            browser.close()
        print("Quiz QA passed: instant feedback, saved selection, answer order, and twenty-five expanded mobile lessons.")
    finally:
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=5)
