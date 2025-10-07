from PIL import Image, ImageDraw

ACCENT_TOP = (14, 165, 233)   # #0ea5e9
ACCENT_BOTTOM = (3, 105, 161)  # #0369a1
WHITE = (255, 255, 255)
BG_RADIUS = 96


def lerp(a, b, t):
    return int(a + (b - a) * t)


def gradient(size):
    w, h = size, size
    img = Image.new('RGB', (w, h), ACCENT_TOP)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        r = lerp(ACCENT_TOP[0], ACCENT_BOTTOM[0], t)
        g = lerp(ACCENT_TOP[1], ACCENT_BOTTOM[1], t)
        b = lerp(ACCENT_TOP[2], ACCENT_BOTTOM[2], t)
        for x in range(w):
            px[x, y] = (r, g, b)
    return img


def rounded_rect(draw: ImageDraw.ImageDraw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill)


def draw_calculator(draw: ImageDraw.ImageDraw, size):
    # Outer soft glass panel (semi-transparent white)
    pad = int(size * 0.22)
    rounded_rect(draw, (pad, pad, size - pad, size - pad), int(size * 0.06), fill=(255, 255, 255, 46))

    # Display bar
    disp_x = int(size * 0.29)
    disp_y = int(size * 0.31)
    disp_w = int(size * 0.42)
    disp_h = int(size * 0.12)
    rounded_rect(draw, (disp_x, disp_y, disp_x + disp_w, disp_y + disp_h), int(size * 0.04), fill=WHITE)

    # Two keys
    key_size = int(size * 0.18)
    gap = int(size * 0.04)
    key_y = int(size * 0.56)
    key1_x = int(size * 0.29)
    key2_x = key1_x + key_size + gap
    rounded_rect(draw, (key1_x, key_y, key1_x + key_size, key_y + key_size), int(size * 0.06), fill=WHITE)
    rounded_rect(draw, (key2_x, key_y, key2_x + key_size, key_y + key_size), int(size * 0.06), fill=WHITE)


def make_icon(size, out_path):
    base = gradient(size).convert('RGBA')
    overlay = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)

    # Rounded outer shape
    rounded_rect(d, (0, 0, size, size), int(size * 0.18), fill=None)  # path kept for semantic symmetry

    draw_calculator(d, size)
    out = Image.alpha_composite(base, overlay)
    out.save(out_path, format='PNG')


if __name__ == '__main__':
    make_icon(180, '/workspace/calculator/icons/icon-180.png')
    make_icon(192, '/workspace/calculator/icons/icon-192.png')
    make_icon(512, '/workspace/calculator/icons/icon-512.png')
    print('Generated PNG icons.')
