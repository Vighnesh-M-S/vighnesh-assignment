from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets
from .models import Rule
from .serializers import RuleSerializer
from .ast import Node

class RuleViewSet(viewsets.ModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer

def create_rule(rule_string):
    # Basic parsing logic (you can expand this for more complex rules)
    tokens = rule_string.split()
    root = None
    current = None

    for token in tokens:
        if token in ["AND", "OR"]:
            new_node = Node("operator", left=current)
            if root is None:
                root = new_node
            else:
                root.right = new_node
            current = new_node
        else:
            new_node = Node("operand", value=token)
            if current is None:
                root = new_node
            else:
                current.right = new_node
            current = new_node

    return root

def rule_to_ast(request):
    rule_string = request.GET.get('rule_string', '')
    if not rule_string:
        return JsonResponse({'error': 'No rule string provided.'}, status=400)

    ast = create_rule(rule_string)
    
    # Convert the AST to a dictionary for JSON serialization
    def node_to_dict(node):
        if node is None:
            return None
        return {
            'type': node.type,
            'value': node.value,
            'left': node_to_dict(node.left),
            'right': node_to_dict(node.right)
        }

    ast_dict = node_to_dict(ast)
    return JsonResponse(ast_dict, safe=False)

def index(request):
    return render(request, 'index2.html')