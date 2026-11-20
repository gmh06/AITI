param([string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path, [ValidatePattern('^v\d+(?:/(?:panel|burst))?$')][string]$Version = 'v2')
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$folder=Join-Path $ProjectRoot ('asset/design/card-studies/'+$Version)
$study=Get-Content -LiteralPath (Join-Path $folder 'scenes.json') -Raw | ConvertFrom-Json
function Get-Color($hex,$opacity=1) {
    $c=[System.Drawing.ColorTranslator]::FromHtml($hex)
    return [System.Drawing.Color]::FromArgb([int](255*$opacity),$c)
}
function Get-RoundedPath($x,$y,$w,$h,$radius) {
    $p=[System.Drawing.Drawing2D.GraphicsPath]::new()
    if($radius -le 0){$p.AddRectangle([System.Drawing.RectangleF]::new($x,$y,$w,$h))}
    else {
        $d=[single](2*[Math]::Min($radius,[Math]::Min($w,$h)/2))
        $p.AddArc([single]$x,[single]$y,$d,$d,180,90)
        $p.AddArc([single]($x+$w-$d),[single]$y,$d,$d,270,90)
        $p.AddArc([single]($x+$w-$d),[single]($y+$h-$d),$d,$d,0,90)
        $p.AddArc([single]$x,[single]($y+$h-$d),$d,$d,90,90)
        $p.CloseFigure()
    }
    return ,$p
}
function Draw-Ops($g,$ops) {
    foreach($o in $ops) {
        $opacity=if($null -eq $o.opacity){1}else{[double]$o.opacity}
        switch($o.type) {
            'group' {
                $state=$g.Save()
                $g.TranslateTransform([single]($o.x+$o.w/2),[single]($o.y+$o.h/2))
                $g.RotateTransform([single]$o.rotation)
                $g.TranslateTransform([single](-$o.w/2),[single](-$o.h/2))
                Draw-Ops $g $o.children
                $g.Restore($state)
            }
            'image' {
                $im=[System.Drawing.Image]::FromFile((Join-Path $ProjectRoot $o.file))
                $state=$g.Save()
                if($o.radius -gt 0){$clip=Get-RoundedPath $o.x $o.y $o.w $o.h $o.radius;$g.SetClip($clip,[System.Drawing.Drawing2D.CombineMode]::Intersect);$clip.Dispose()}
                $sr=$o.sourceRect
                $g.DrawImage($im,[System.Drawing.RectangleF]::new($o.x,$o.y,$o.w,$o.h),[System.Drawing.RectangleF]::new($sr[0],$sr[1],$sr[2],$sr[3]),[System.Drawing.GraphicsUnit]::Pixel)
                $g.Restore($state);$im.Dispose()
            }
            'rect' {
                $shape=Get-RoundedPath $o.x $o.y $o.w $o.h $o.radius
                if($o.fill -and $o.fill -ne 'none'){$b=[System.Drawing.SolidBrush]::new((Get-Color $o.fill $opacity));$g.FillPath($b,$shape);$b.Dispose()}
                if($o.stroke -and $o.stroke -ne 'none'){$p=[System.Drawing.Pen]::new((Get-Color $o.stroke $opacity),[single]$o.strokeWidth);$g.DrawPath($p,$shape);$p.Dispose()}
                $shape.Dispose()
            }
            'ellipse' {
                $b=[System.Drawing.SolidBrush]::new((Get-Color $o.fill $opacity));$g.FillEllipse($b,[single]$o.x,[single]$o.y,[single]$o.w,[single]$o.h);$b.Dispose()
                if($o.stroke){$p=[System.Drawing.Pen]::new((Get-Color $o.stroke $opacity),[single]$o.strokeWidth);$g.DrawEllipse($p,[single]$o.x,[single]$o.y,[single]$o.w,[single]$o.h);$p.Dispose()}
            }
            'lettering' {
                $outline=Get-Content -LiteralPath (Join-Path $ProjectRoot $o.outlineFile) -Raw -Encoding UTF8 | ConvertFrom-Json
                $state=$g.Save();$g.TranslateTransform([single]$o.x,[single]$o.y);$g.ScaleTransform([single]($o.w/$outline.width),[single]($o.h/$outline.height))
                $shape=[System.Drawing.Drawing2D.GraphicsPath]::new([System.Drawing.Drawing2D.FillMode]::Winding)
                $px=0.0;$py=0.0
                foreach($command in $outline.commands){
                    $points=$command[1]
                    switch($command[0]){
                        'moveTo' {$shape.StartFigure();$px=[single]$points[0][0];$py=[single]$points[0][1]}
                        'lineTo' {$nx=[single]$points[0][0];$ny=[single]$points[0][1];$shape.AddLine($px,$py,$nx,$ny);$px=$nx;$py=$ny}
                        'curveTo' {$shape.AddBezier($px,$py,[single]$points[0][0],[single]$points[0][1],[single]$points[1][0],[single]$points[1][1],[single]$points[2][0],[single]$points[2][1]);$px=[single]$points[2][0];$py=[single]$points[2][1]}
                        'closePath' {$shape.CloseFigure()}
                    }
                }
                $b=[System.Drawing.SolidBrush]::new((Get-Color $o.fill $opacity));$g.FillPath($b,$shape);$b.Dispose();$shape.Dispose();$g.Restore($state)
            }
            'polygon' {
                $pts=[System.Drawing.PointF[]]@($o.points | ForEach-Object {[System.Drawing.PointF]::new($_[0],$_[1])})
                $b=[System.Drawing.SolidBrush]::new((Get-Color $o.fill $opacity));$g.FillPolygon($b,$pts);$b.Dispose()
                if($o.stroke){$p=[System.Drawing.Pen]::new((Get-Color $o.stroke $opacity),[single]$o.strokeWidth);$g.DrawPolygon($p,$pts);$p.Dispose()}
            }
            'line' {
                $p=[System.Drawing.Pen]::new((Get-Color $o.stroke $opacity),[single]$o.width);$g.DrawLine($p,[single]$o.x1,[single]$o.y1,[single]$o.x2,[single]$o.y2);$p.Dispose()
            }
            'text' {
                $style=if($o.bold){[System.Drawing.FontStyle]::Bold}else{[System.Drawing.FontStyle]::Regular}
                $family=if($o.fontFamily){$o.fontFamily}else{'Microsoft YaHei'}
                $font=[System.Drawing.Font]::new($family,[single]$o.size,$style,[System.Drawing.GraphicsUnit]::Pixel)
                $b=[System.Drawing.SolidBrush]::new((Get-Color $o.color $opacity));$g.DrawString($o.value,$font,$b,[single]$o.x,[single]$o.y,[System.Drawing.StringFormat]::GenericTypographic);$b.Dispose();$font.Dispose()
            }
        }
    }
}
foreach($scene in $study.scenes) {
    $bmp=[System.Drawing.Bitmap]::new(1200,1800)
    $g=[System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.ScaleTransform(2,2)
    $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    Draw-Ops $g $scene.ops
    $bmp.Save((Join-Path $folder ($scene.id+'.png')),[System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose();$bmp.Dispose()
}
foreach($kind in @('overview','hero')) {
    $models=if($kind -eq 'hero'){@('gpt','grok','doubao')}else{@('gpt','deepseek','glm','grok','kimi','claude','gemini','doubao')}
    $cols=if($kind -eq 'hero'){3}else{4}
    $cellW=if($kind -eq 'hero'){430}else{355}
    $cellH=if($kind -eq 'hero'){690}else{565}
    $rows=[int][Math]::Ceiling($models.Count/$cols)
    $bmp=[System.Drawing.Bitmap]::new(($cols*$cellW),($rows*$cellH))
    $g=[System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::FromArgb(228,234,240))
    $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $font=[System.Drawing.Font]::new('Microsoft YaHei',15,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
    for($i=0;$i -lt $models.Count;$i++) {
        $x=($i%$cols)*$cellW;$y=[int][Math]::Floor($i/$cols)*$cellH
        if($study.previewLabels -ne $false){$g.DrawString($models[$i],$font,[System.Drawing.Brushes]::Black,[single]($x+18),[single]($y+10))}
        $im=[System.Drawing.Image]::FromFile((Join-Path $folder ($models[$i]+'.png')))
        $w=$cellW-36;$h=[int]($w*1.5)
        $cardY=if($study.previewLabels -eq $false){($cellH-$h)/2}else{38}
        $g.DrawImage($im,[int]($x+18),[int]($y+$cardY),[int]$w,[int]$h)
        $im.Dispose()
    }
    $bmp.Save((Join-Path $folder ($kind+'.jpg')),[System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose();$bmp.Dispose();$font.Dispose()
}
Write-Output (Join-Path $folder 'hero.jpg')
