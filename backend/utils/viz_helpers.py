import lolviz
from PIL import Image, ImageDraw, ImageFont
import os
import shutil
from uuid import uuid4


def array_ops(arr, operation, value=None):
    if operation not in ["push", "pop", "enqueue", "dequeue"]:
        raise ValueError(
            "Invalid operation. Use 'push', 'pop', 'enqueue', or 'dequeue'."
        )

    else:
        if operation == "push":
            arr.append(value)

        elif operation == "pop":
            if arr:
                value = arr.pop()
            else:
                arr = []
                value = None

        elif operation == "enqueue":
            arr.append(value)

        elif operation == "dequeue":
            if arr:
                value = arr[0]
                arr = arr[1:]
            else:
                arr = []
                value = None

    return arr, value


def create_centered_text_image(
    text, width, height, font_path=None, font_size=40, output_path="output_image.png"
):
    # Create a blank image with a white background
    image = Image.new("RGB", (width, height), color="white")

    # Initialize ImageDraw object
    draw = ImageDraw.Draw(image)

    # Set the font (use default if font_path is not provided)
    if font_path is not None:
        try:
            font = ImageFont.truetype(font_path, font_size)
        except Exception as e:
            print(e)
            font = ImageFont.load_default()
    else:
        font = ImageFont.load_default()

    # Function to wrap text within a given width
    def wrap_text(text, font, max_width):
        words = text.split()  # Split text into words
        lines = []
        current_line = []
        for word in words:
            # Try adding the next word to the current line
            current_line.append(word)
            # Get the bounding box of the current line
            bbox = draw.textbbox((0, 0), " ".join(current_line), font=font)
            line_width = bbox[2] - bbox[0]  # Calculate the width from the bbox
            if line_width > max_width:
                # If the line is too wide, move the last word to a new line
                current_line.pop()
                lines.append(" ".join(current_line))
                current_line = [word]
        lines.append(" ".join(current_line))  # Add the last line
        return lines

    # Wrap the text
    wrapped_text = wrap_text(text, font, width)

    # Calculate the total height of the wrapped text
    text_height = sum(
        [
            draw.textbbox((0, 0), line, font=font)[3]
            - draw.textbbox((0, 0), line, font=font)[1]
            for line in wrapped_text
        ]
    )
    line_height = (
        draw.textbbox((0, 0), wrapped_text[0], font=font)[3]
        - draw.textbbox((0, 0), wrapped_text[0], font=font)[1]
    )

    # Calculate the starting Y position to center the text vertically
    y = (height - text_height) // 2

    # Draw each line of text centered
    for line in wrapped_text:
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, y), line, font=font, fill="black")
        y += line_height  # Move to the next line

    # Save the image
    image.save(output_path)


def create_animated_gif_centered(
    input_dir,
    output_dir,
    output_filename="animated.gif",
    duration=500,
    background_color=(255, 255, 255),
):
    """
    Create an animated GIF from PNG images, centering each image on a uniform canvas.

    Parameters:
    - input_dir (str): The directory containing the PNG images.
    - output_dir (str): The directory to save the output GIF.
    - output_filename (str): The name of the output GIF file (default is 'animated.gif').
    - duration (int): Duration between frames in milliseconds (default is 500ms).
    - background_color (tuple): Background color for the canvas (default is white).
    """
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Get all PNG files from the input directory and sort them by filename
    images = sorted([file for file in os.listdir(input_dir) if file.endswith(".png")])

    # Check if any images are found
    if not images:
        print("No PNG images found in the directory.")
        return

    # Open each image and store their sizes
    image_sequence = []
    sizes = []

    for image_file in images:
        image_path = os.path.join(input_dir, image_file)
        img = Image.open(image_path)
        sizes.append(img.size)
        image_sequence.append(img)

    # Calculate the maximum width and height to create a uniform canvas
    max_width = max([size[0] for size in sizes])
    max_height = max([size[1] for size in sizes])

    # Create a centered canvas for each image
    canvas_sequence = []

    for img in image_sequence:
        # Create a blank canvas (max_width x max_height)
        canvas = Image.new("RGB", (max_width, max_height), color=background_color)

        # Calculate the position to paste the image (to center it)
        x_offset = (max_width - img.width) // 2
        y_offset = (max_height - img.height) // 2

        # Paste the image onto the canvas, centered
        canvas.paste(img, (x_offset, y_offset))

        # Add the canvas to the sequence
        canvas_sequence.append(canvas)

    # Save as an animated GIF
    output_path = os.path.join(output_dir, output_filename)
    canvas_sequence[0].save(
        output_path,
        save_all=True,
        append_images=canvas_sequence[1:],
        duration=duration,
        loop=0,
    )

    print(f"Animated GIF saved at {output_path}")


def viz_op(
    arr: list,
    operation: str,
    values: list,
    dtype: str,
    dir=f"render-",
    output_dir=".",
    cleanup=True,
    gif_heading="",
    assets_dir="",
    duration: int = 2000,
):

    # dtype
    if dtype not in ["stack", "queue"]:
        raise ValueError("Invalid dtype. Use 'stack' or 'queue'.")

    # If dtype is stack
    elif dtype == "stack" and operation not in ["push", "pop"]:
        raise ValueError("Invalid operations for dtype 'stack'. Use 'push' and 'pop'.")

    # if dtype is queue
    elif dtype == "queue" and operation not in ["enqueue", "dequeue"]:
        raise ValueError(
            "Invalid operations for dtype 'stack'. Use 'enqueue' and 'dequeue'."
        )

    elif dtype == "stack" and len(arr) > 0:
        viz_arr = {
            "pointer top" if key == 0 else f"index {len(arr) - key}": value
            for key, value in enumerate(arr[::-1])
        }
    elif dtype == "stack" and len(arr) <= 0:
        viz_arr = []

    else:
        viz_arr = arr

    # Make a session id
    session_id = str(uuid4())
    dir = output_dir + "/" + dir + session_id + "/"
    if os.path.exists(dir):
        shutil.rmtree(dir)
        os.makedirs(dir)
    else:
        os.makedirs(dir)

    min_canvas_width, min_canvas_height = 200, 200

    # Make the Heading
    create_centered_text_image(
        text=gif_heading,
        width=min_canvas_width,
        height=min_canvas_height,
        font_path=assets_dir + "/assets/fonts/montserrat.regular.ttf",
        font_size=15,
        output_path=f'{dir}{os.sep}viz-{"0".zfill(4)}.png',
    )
    lolviz.objviz(viz_arr).render(f'{dir}{os.sep}viz-{"1".zfill(4)}', format="png")

    # Iterate through the operations
    for step, value in enumerate(values):

        # Perform push or pop and specify the heading
        if operation == "push" or operation == "pop":
            arr, value = array_ops(arr, operation, value)
            if operation == "push":
                heading_str = f"PUSHING: {value} into STACK"

            elif operation == "pop" and value is not None:
                heading_str = f"POPPING: {value} from STACK"

            else:
                heading_str = "POPPING: (empty stack)"

            # For stack create a dict
            if isinstance(arr, list) and len(arr) > 0:
                viz_arr = {
                    "pointer top" if key == 0 else f"index {len(arr) - key}": value
                    for key, value in enumerate(arr[::-1])
                }

            else:
                viz_arr = arr

            lolviz.objviz(viz_arr).render(
                f"{dir}{os.sep}viz-{str((step+1)*10).zfill(4)}", format="png"
            )
            create_centered_text_image(
                text=heading_str,
                width=min_canvas_width,
                height=min_canvas_height,
                font_path=assets_dir + "/assets/fonts/montserrat.regular.ttf",
                font_size=15,
                output_path=f"{dir}{os.sep}viz-{str((step+1)*10).zfill(4)}-text.png",
            )

        # Perform enqueue or dequeue and specify the heading
        elif operation == "enqueue" or operation == "dequeue":
            arr, value = array_ops(arr, operation, value)
            if operation == "enqueue":
                heading_str = f"ENQUEUE: {value} into QUEUE"

            elif operation == "dequeue" and value is not None:
                heading_str = f"DEQUEUE: {value} from QUEUE"

            else:
                heading_str = "DEQUEUE: (empty queue)"
            lolviz.objviz(arr).render(
                f"{dir}{os.sep}viz-{str((step+1)*10).zfill(4)}", format="png"
            )
            create_centered_text_image(
                text=heading_str,
                width=min_canvas_width,
                height=min_canvas_height,
                font_path=assets_dir + "/assets/fonts/montserrat.regular.ttf",
                font_size=15,
                output_path=f"{dir}{os.sep}viz-{str((step+1)*10).zfill(4)}-text.png",
            )

    # Create GIF
    create_animated_gif_centered(
        input_dir=dir,
        output_dir=output_dir,
        output_filename=f"render-{session_id}.gif",
        duration=duration,
    )

    # Cleanup op
    if cleanup:
        shutil.rmtree(dir)

    # return
    return {
        "session_id": session_id,
        "gif_path": f"{output_dir}/render-{session_id}.gif".replace(assets_dir, ""),
        "state": arr,
    }
