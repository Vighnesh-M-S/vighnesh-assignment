from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RuleViewSet, index, rule_to_ast

router = DefaultRouter()
router.register(r'rules', RuleViewSet)

urlpatterns = [
    # path('', index, name='index'),
    path('', include(router.urls)),
    path('api/', include(router.urls)),
    path('api/rule_to_ast/', rule_to_ast, name='rule_to_ast'),
]