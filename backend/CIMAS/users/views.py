from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        role = data.get('role', 'victim')  # default role = victim

        if not all([email, password, first_name, last_name]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        # create user
        user = User.objects.create_user(
            email=email,
            username=email,  # still needed for AbstractUser base
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        tokens = get_tokens_for_user(user)

        return JsonResponse({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': tokens
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        user = authenticate(username=email, password=password)

        if user is not None:
            tokens = get_tokens_for_user(user)
            return JsonResponse({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role,
                },
                'tokens': tokens
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return JsonResponse({'message': 'Successfully logged out'})
    except Exception:
        return JsonResponse({'error': 'Invalid token'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    return JsonResponse({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_me(request):
    try:
        data = json.loads(request.body)
        user = request.user

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            if User.objects.exclude(id=user.id).filter(email=data['email']).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            user.email = data['email']

        user.save()
        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_users(request):
    users = User.objects.all()
    users_data = [{
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'is_active': user.is_active,
        'is_staff': user.is_staff
    } for user in users]

    return JsonResponse({'users': users_data})


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_user(request, id):
    try:
        user = User.objects.get(id=id)
        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'is_active': user.is_active,
            'is_staff': user.is_staff
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user(request, id):
    try:
        data = json.loads(request.body)
        user = User.objects.get(id=id)

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            if User.objects.exclude(id=user.id).filter(email=data['email']).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            user.email = data['email']
        if 'is_active' in data and isinstance(data['is_active'], bool):
            user.is_active = data['is_active']
        if 'is_staff' in data and isinstance(data['is_staff'], bool):
            user.is_staff = data['is_staff']
        if 'role' in data:
            user.role = data['role']

        user.save()
        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'is_active': user.is_active,
            'is_staff': user.is_staff
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, id):
    try:
        user = User.objects.get(id=id)
        if user.id == request.user.id:
            return JsonResponse({'error': 'Cannot delete yourself'}, status=400)
        user.delete()
        return JsonResponse({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
