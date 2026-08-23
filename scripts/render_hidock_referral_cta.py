from __future__ import annotations

import argparse
import glob
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("base", type=Path)
    parser.add_argument("qr", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    image = Image.open(args.base).convert("RGBA")
    width, height = image.size

    font_candidates = glob.glob("/System/Library/Fonts/*W6.ttc")
    if not font_candidates:
        raise FileNotFoundError("ヒラギノ角ゴシック W6 が見つかりません")

    font_path = font_candidates[0]
    heading_font = ImageFont.truetype(font_path, round(height * 0.052))
    discount_font = ImageFont.truetype(font_path, round(height * 0.042))
    caption_font = ImageFont.truetype(font_path, round(height * 0.025))

    navy = "#17345B"
    cyan = "#2A9DB0"
    white = "#FFFFFF"
    warm_white = "#FFFDF8"

    panel_left = round(width * 0.555)
    panel_right = round(width * 0.962)
    panel_top = round(height * 0.055)
    panel_bottom = round(height * 0.945)
    panel_width = panel_right - panel_left

    shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (panel_left + 8, panel_top + 12, panel_right + 8, panel_bottom + 12),
        radius=round(height * 0.035),
        fill=(23, 52, 91, 46),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(round(height * 0.012)))
    image = Image.alpha_composite(image, shadow)

    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(
        (panel_left, panel_top, panel_right, panel_bottom),
        radius=round(height * 0.035),
        fill=(255, 253, 248, 244),
        outline=(23, 52, 91, 36),
        width=2,
    )

    content_left = panel_left + round(panel_width * 0.085)
    content_right = panel_right - round(panel_width * 0.085)
    content_width = content_right - content_left

    draw.text((content_left, panel_top + round(height * 0.052)), "HiDock P1 紹介リンク", font=heading_font, fill=navy)

    badge_top = panel_top + round(height * 0.135)
    badge_bottom = badge_top + round(height * 0.088)
    draw.rounded_rectangle((content_left, badge_top, content_right, badge_bottom), radius=24, fill=navy)
    discount = "紹介リンク限定 10%OFF"
    discount_box = draw.textbbox((0, 0), discount, font=discount_font)
    discount_width = discount_box[2] - discount_box[0]
    draw.text(
        (content_left + (content_width - discount_width) / 2, badge_top + round(height * 0.008)),
        discount,
        font=discount_font,
        fill=white,
    )

    qr = Image.open(args.qr).convert("RGB")
    if qr.width != qr.height:
        raise ValueError(f"QR must be square: {qr.size}")

    qr_size = min(round(height * 0.39), round(content_width * 0.72))
    qr = qr.resize((qr_size, qr_size), Image.Resampling.NEAREST)
    quiet_zone = round(qr_size * 0.09)
    qr_card_size = qr_size + quiet_zone * 2
    qr_x = panel_left + (panel_width - qr_card_size) // 2
    qr_y = badge_bottom + round(height * 0.045)

    image = Image.alpha_composite(image, overlay)
    qr_card = Image.new("RGB", (qr_card_size, qr_card_size), warm_white)
    qr_card.paste(qr, (quiet_zone, quiet_zone))
    image.paste(qr_card, (qr_x, qr_y))

    draw = ImageDraw.Draw(image)
    caption = "QRコードまたは記事内ボタンから購入ページへ"
    caption_box = draw.textbbox((0, 0), caption, font=caption_font)
    caption_width = caption_box[2] - caption_box[0]
    draw.text(
        (panel_left + (panel_width - caption_width) / 2, panel_bottom - round(height * 0.064)),
        caption,
        font=caption_font,
        fill=navy,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(args.output, format="PNG", optimize=True)
    print(args.output)


if __name__ == "__main__":
    main()
