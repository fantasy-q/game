# ImageMagicK

## 旋转 Rotate

```powershell
magick mogrify -verbose -monitor -rotate 1 *.png
```

## 剪裁 Crop

```powershell
magick *.png -monitor -crop 650x450+15+465 +repage -scene 1 "cropped_%03d.png"

$i=1; ls *.png | sort { [int]($_.Name -replace '\D+','') } | `
% { magick $_ -monitor -crop 650x450+15+465 +repage ("cropped_{0:D3}.png" -f $i++) }
```

## 网格 Tile

```powershell
$row=40; magick -verbose montage *.png -tile 3x$row -geometry +0+0 -mode concatenate ../grid.png

#---
-tile 3x39           # 39列 × 3行
-geometry +0+0       # 零间距（水平0像素/垂直0像素）
-mode concatenate    # 确保紧密拼接
-background none     # 透明背景（或指定颜色）
```

# PowerShell

## 重命名

```powershell
$i=1; Get-ChildItem *.png | % { Write-Output "$($_.Name) -> $("{0:D3}{1}" -f ($i++),$_.Extension)" }

# ls Get-ChildItem 列出目录内容（类似 Unix 的 ls 或 Windows 的 dir）
# echo Write-Output 输出内容到控制台（如 echo "Hello"），默认情况下，PowerShell 会自动将未捕获的对象传递给 Write-Output（因此通常无需显式调用）。

$i=1; ls *.png | % { "$($_.Name) -> $("{0:D3}{1}{2}" -f ($i++), '_1', $_.Extension)" }

$i=1; ls *.png | `
% { ("Moving: " + $_.FullName + " -> " + (Join-Path $_.Directory.Parent.FullName ("{0:D3}{1}" -f $i++, $_.Extension))) }

$n=2; $i=1; ls *.png | `
% { cp $_ -Destination (Join-Path $_.Directory.Parent.FullName ("{0:D3}{1}{2}" -f $i++, "_$n", $_.Extension)) }
```

# Inkscape

## Align & Distribute
最开始开始使用 `Grid Distribute`，发现数字文本没有按照 TextID 顺序来。

需要**手动**粗排一下，首末数字需要严格对齐，使用 `Center on vertical axis` 居中对齐，再使用`Even vertical gaps`。

不知道有无完全自动的方法。
