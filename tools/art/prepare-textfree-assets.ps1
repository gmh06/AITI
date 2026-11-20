param([string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$targetDir = Join-Path $ProjectRoot 'asset/nonhuman/cards/textfree'
$operations = Get-Content -LiteralPath (Join-Path $targetDir 'operations.json') -Raw | ConvertFrom-Json
$pages = [System.Collections.Generic.List[string]]::new()
foreach ($item in $operations.outputs) {
    $sourcePath = Join-Path $ProjectRoot $item.source
    $outputPath = Join-Path $targetDir $item.file
    if (Test-Path -LiteralPath $outputPath) { throw "Output already exists: $outputPath" }
    $original = [System.Drawing.Image]::FromFile($sourcePath)
    $bitmap = [System.Drawing.Bitmap]::new(1024,1536,[System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.DrawImageUnscaled($original,0,0)
    $m = $item.mask
    $centerX = [single]($m.x + $m.width/2)
    $centerY = [single]($m.y + $m.height/2)
    $graphics.TranslateTransform($centerX,$centerY)
    $graphics.RotateTransform([single]$m.rotation)
    $graphics.FillRectangle([System.Drawing.Brushes]::White,[single](-$m.width/2),[single](-$m.height/2),[single]$m.width,[single]$m.height)
    $graphics.ResetTransform()
    $bitmap.Save($outputPath,[System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose(); $bitmap.Dispose(); $original.Dispose()
    $base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($sourcePath))
    $page = @"
<diagram id="$($item.model)" name="$($item.model)"><mxGraphModel dx="1024" dy="1536" grid="1" gridSize="10" page="1" pageScale="1" pageWidth="1024" pageHeight="1536" background="#FFFFFF"><root>
<mxCell id="0"/><mxCell id="original-layer" value="Original approved image" parent="0"/><mxCell id="mask-layer" value="Text removal mask" parent="0"/>
<mxCell id="original" value="" style="shape=image;imageAspect=0;aspect=fixed;image=data:image/png,$base64;locked=1;" vertex="1" parent="original-layer"><mxGeometry x="0" y="0" width="1024" height="1536" as="geometry"/></mxCell>
<mxCell id="mask" value="" style="shape=rectangle;fillColor=#FFFFFF;strokeColor=none;rotation=$($m.rotation);" vertex="1" parent="mask-layer"><mxGeometry x="$($m.x)" y="$($m.y)" width="$($m.width)" height="$($m.height)" as="geometry"/></mxCell>
</root></mxGraphModel></diagram>
"@
    $pages.Add($page)
    Write-Output $outputPath
}
$xml = '<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" type="device">' + ($pages -join '') + '</mxfile>'
[IO.File]::WriteAllText((Join-Path $targetDir 'textfree.drawio'),$xml,[Text.UTF8Encoding]::new($false))
