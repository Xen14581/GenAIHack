from flask import current_app as app
from models import ModuleSchema, CodingRound
from google.generativeai import GenerativeModel
from .viz_helpers import viz_op
import os


def show_visualizations(
    topic: str, operation: str, user_id: str = None, config: dict = None
):
    """
    Description: Generate a visualization of the data structure operation type or traversal type while explaining the operation or traversal everytime
    Arguments:
    1) topic - the data structure topic being taught
    2) operation - the data structure operation or traversal to be visualized
    """
    topic = topic.casefold()
    match topic:
        case "stack":
            if (
                operation.casefold() == "push"
                or operation.casefold() == "push operation"
            ):
                return "render", "/assets/stack/push.gif"
            if operation.casefold() == "pop" or operation.casefold() == "pop operation":
                return "render", "/assets/stack/pop.gif"
        case "queue":
            if (
                operation.casefold() == "enqueue"
                or operation.casefold() == "enqueue operation"
            ):
                return "render", "/assets/queue/enqueue.gif"
            if (
                operation.casefold() == "dequeue"
                or operation.casefold() == "dequeue operation"
            ):
                return "render", "/assets/queue/dequeue.gif"
        case "tree":
            if (
                operation.casefold() == "in-order traversal"
                or operation.casefold() == "in-order"
            ):
                return "render", "/assets/tree/inorder.gif"
            if (
                operation.casefold() == "pre-order traversal"
                or operation.casefold() == "post-order"
            ):
                return "render", "/assets/tree/preorder.gif"
            if (
                operation.casefold() == "post-order traversal"
                or operation.casefold() == "pre-order"
            ):
                return "render", "/assets/tree/postorder.gif"
        case "graph":
            if operation.casefold() == "dfs" or operation.casefold() == "dfs traversal":
                return "render", "/assets/graph/dfs.gif"
            if operation.casefold() == "bfs" or operation.casefold() == "bfs traversal":
                return "render", "/assets/graph/bfs.gif"


def generate_custom_visualization_on_user_data(
    topic: str,
    operation: str,
    inputs: str,
    existing_values: str,
    user_id: str = None,
    assets_dir: str = None,
):
    """
    Description: Take data as input in the form of list for generating a custom visualization of a particular operation or traversal everytime
    Arguments:
    1) topic - The data structure topic being taught (stack, queue, tree, graph)
    2) operation - The data structure operation or traversal to be visualized
    3) inputs - The input data to be added to the data structure for visualization (seperate multiple inputs with a comma (,))
    4) existing_values - The existing values present in the stack (seperate multiple values with a comma (,))
    Returns: The visulaization of the operation of the data structure being taught
    """
    inputs = inputs.split(",")
    inputs = [int(i.strip()) for i in inputs if i != ""]
    existing_inputs = existing_values.split(",")
    existing_inputs = [int(i.strip()) for i in existing_inputs if i != ""]

    topic = topic.casefold()
    save_dir = assets_dir + f"/assets/{user_id}"
    os.makedirs(assets_dir, exist_ok=True)
    match topic:
        case "stack":
            if (
                operation.casefold() == "push"
                or operation.casefold() == "push operation"
            ):
                viz = viz_op(
                    assets_dir=assets_dir,
                    arr=existing_inputs,
                    operation="push",
                    values=inputs,
                    gif_heading="PUSHING in STACK",
                    dtype="stack",
                    output_dir=save_dir,
                )
                return "render", viz["gif_path"]
            if operation.casefold() == "pop" or operation.casefold() == "pop operation":
                viz = viz_op(
                    assets_dir=assets_dir,
                    arr=existing_inputs,
                    operation="pop",
                    values=[None],
                    gif_heading="POPPING in STACK",
                    dtype="stack",
                    output_dir=save_dir,
                )
                return "render", viz["gif_path"]
        case "queue":
            if (
                operation.casefold() == "enqueue"
                or operation.casefold() == "enqueue operation"
            ):
                viz = viz_op(
                    assets_dir=assets_dir,
                    arr=existing_inputs,
                    operation="enqueue",
                    values=inputs,
                    gif_heading="ENQUEING in QUEUE",
                    dtype="queue",
                    output_dir=save_dir,
                )
                return "render", viz["gif_path"]
            if (
                operation.casefold() == "dequeue"
                or operation.casefold() == "dequeue operation"
            ):
                viz = viz_op(
                    assets_dir=assets_dir,
                    arr=existing_inputs,
                    operation="dequeue",
                    values=[None],
                    gif_heading="DEQUEING in QUEUE",
                    dtype="queue",
                    output_dir=save_dir,
                )
                return "render", viz["gif_path"]


def generate_example_image(topic: str, user_id: str = None, assets_dir: str = None):
    """
    Description: Take the data structure(stack or queue) being taught as the input and output the example image of the data structure
    Arguments:
    1) topic - The data structure being taught
    Returns: An example image fo the data structure being taught
    """
    if "stack" in topic.casefold():
        return "render", "/assets/example/stack_example.png"
    elif "queue" in topic.casefold():
        return "render", "/assets/example/queue_example.png"


def init_modules():
    modules = ModuleSchema.query.all()
    for module in modules:
        coding_round = CodingRound.query.filter_by(id=module.coding_round_id).first()
        app.config.setdefault(
            f"module_{str(module.id)}_model",
            GenerativeModel(
                "gemini-1.5-flash",
                system_instruction=module.prompt,
                tools=[
                    generate_example_image,
                    generate_custom_visualization_on_user_data,
                ],
            ),
        )
        app.config.setdefault(
            f"coding_round_{str(module.id)}_model",
            GenerativeModel("gemini-1.5-flash", system_instruction=coding_round.prompt),
        )
