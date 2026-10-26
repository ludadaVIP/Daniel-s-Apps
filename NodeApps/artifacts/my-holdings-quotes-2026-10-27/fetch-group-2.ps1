$quoteArtifactRoot = $PSScriptRoot
$quoteSymbols = Get-Content -LiteralPath (Join-Path $quoteArtifactRoot 'group-2.json') -Raw | ConvertFrom-Json
$quoteEtfs = @('VTI','VT','VGT','SOXX','SMH','VOO','QQQM')
$quoteEvidenceDirectory = Join-Path $quoteArtifactRoot 'group-2-evidence'
foreach ($quoteSymbol in $quoteSymbols) {
    $quoteKind = if ($quoteEtfs -contains $quoteSymbol) { 'etf' } else { 'stocks' }
    $quoteUrl = 'https://stockanalysis.com/' + $quoteKind + '/' + $quoteSymbol.ToLowerInvariant() + '/history/'
    try {
        $quoteResponse = Invoke-WebRequest -Uri $quoteUrl -TimeoutSec 40
        $quoteRawFile = Join-Path $quoteEvidenceDirectory ($quoteSymbol.Replace('.','-') + '.html')
        [System.IO.File]::WriteAllText($quoteRawFile, $quoteResponse.Content, [System.Text.UTF8Encoding]::new($false))
        Write-Output ($quoteSymbol + ' fetched ' + $quoteResponse.Content.Length)
    } catch {
        Write-Output ($quoteSymbol + ' ERROR ' + $_.Exception.Message)
    }
}
