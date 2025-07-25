"""
URL configuration for speech_analyzer project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt import views as auth_views

from analyzer.views import SpeechAnalyzerView, RegisterUserView, PastResultsView, PerformanceGraphView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/analyze-audio/', SpeechAnalyzerView.as_view(), name='speech_analyzer'),
    path('api/past-results/', PastResultsView.as_view(), name='past_results'),
    path('api/performance-graph/', PerformanceGraphView.as_view(), name='performance_graph'),
    path('api/register/', RegisterUserView.as_view(), name='register_user'),
    path('api/token/', auth_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', auth_views.TokenRefreshView.as_view(), name='token_refresh'),
]
