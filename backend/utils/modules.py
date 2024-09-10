from flask import current_app as app
from models import ModuleSchema, CodingRound
from google.generativeai import GenerativeModel


def visualize_traversals(traversal:str):
  """
  Take in any tree traversal type (Inorder traversal, Preorder traversal or Postorder traversal) and return the visualization
  Args:
    i) traversal - any traversal type (inorder,preorder,postorder)
  """

  if traversal.casefold()=="preorder":
    return "render", "/assets/trees/preorder.gif"
  elif traversal.casefold()=="postorder":
    return "render", "/assets/postorder.gif"
  elif traversal.casefold()=="inorder":
    return "render", "/assets/inorder.gif"

def init_modules():
    modules = ModuleSchema.query.all()
    for module in modules:
        coding_round = CodingRound.query.filter_by(id=module.coding_round_id).first()
        app.config.setdefault(
            f"module_{str(module.id)}_model",
            GenerativeModel("gemini-1.5-flash", system_instruction=module.prompt, tools=[visualize_traversals]),
        )
        app.config.setdefault(
            f"coding_round_{str(module.id)}_model",
            GenerativeModel("gemini-1.5-flash", system_instruction=coding_round.prompt),
        )
