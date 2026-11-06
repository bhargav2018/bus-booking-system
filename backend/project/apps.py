from django.apps import AppConfig
from django.db.models.signals import post_save


class ProjectConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'project'
    def ready(self):
        import project.signals