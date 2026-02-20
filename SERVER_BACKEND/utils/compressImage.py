from PIL import Image
from django.core.files import File
from io import BytesIO

def compress_image(img):
    if not img:
        return
    image = Image.open(img)
    im_io = BytesIO()
    # image.save(im_io, "jpeg", quality=70, optimize=True)
    image.save(im_io, image.format, quality=70, optimize=True)
    new_image = File(im_io, name=img.name)
    return new_image
