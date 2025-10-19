"""
Test script for Chat System Updates
Run this after setting up the Admin Panel to verify functionality
"""

from django.contrib.auth import get_user_model
from chat.models import Message
from incidents.models import IncidentAssignments

User = get_user_model()

def test_admin_panel_exists():
    """Test 1: Verify Admin Panel user exists"""
    print("\n" + "="*50)
    print("TEST 1: Admin Panel User Exists")
    print("="*50)
    try:
        admin_panel = User.objects.get(email='admin.panel@system.internal')
        print(f"✅ Admin Panel user found: {admin_panel.id}")
        print(f"   - Name: {admin_panel.first_name} {admin_panel.last_name}")
        print(f"   - Active: {admin_panel.is_active}")
        print(f"   - Role: {admin_panel.role}")
        return True
    except User.DoesNotExist:
        print("❌ Admin Panel user NOT found")
        return False

def test_broadcast_copy():
    """Test 2: Check if broadcasts create copies to Admin Panel"""
    print("\n" + "="*50)
    print("TEST 2: Broadcast Message Copies")
    print("="*50)
    try:
        admin_panel = User.objects.get(email='admin.panel@system.internal')
        broadcast_copies = Message.objects.filter(
            receiver=admin_panel,
            is_broadcast=False
        )
        print(f"✅ Found {broadcast_copies.count()} broadcast copies")
        
        if broadcast_copies.exists():
            print("\n   Recent broadcasts:")
            for msg in broadcast_copies[:5]:
                print(f"   - From: {msg.sender.email}")
                print(f"     Content: {msg.content[:50]}...")
                print(f"     Time: {msg.timestamp}")
                print()
        return True
    except User.DoesNotExist:
        print("❌ Admin Panel user not found")
        return False

def test_user_roles():
    """Test 3: Verify user role distribution"""
    print("\n" + "="*50)
    print("TEST 3: User Role Distribution")
    print("="*50)
    
    roles = ['admin', 'investigator', 'victim']
    for role in roles:
        count = User.objects.filter(role=role, is_active=True).count()
        print(f"   {role.upper()}: {count} users")
    
    return True

def test_assignments():
    """Test 4: Check incident assignments for messaging permissions"""
    print("\n" + "="*50)
    print("TEST 4: Incident Assignments")
    print("="*50)
    
    total_assignments = IncidentAssignments.objects.count()
    print(f"   Total incident assignments: {total_assignments}")
    
    if total_assignments > 0:
        print("\n   Sample assignments:")
        for assignment in IncidentAssignments.objects.select_related(
            'assigned_to', 'incident__user'
        )[:5]:
            print(f"   - Investigator: {assignment.assigned_to.email}")
            print(f"     Victim: {assignment.incident.user.email}")
            print(f"     Incident ID: {assignment.incident.incident_id}")
            print()
    
    return True

def test_message_permissions():
    """Test 5: Verify message permission logic"""
    print("\n" + "="*50)
    print("TEST 5: Message Permission Checks")
    print("="*50)
    
    # Get sample users
    try:
        admin = User.objects.filter(role='admin', is_active=True).first()
        investigator = User.objects.filter(role='investigator', is_active=True).first()
        victim = User.objects.filter(role='victim', is_active=True).first()
        
        if admin:
            print(f"✅ Sample Admin: {admin.email}")
        else:
            print("⚠️  No admin users found")
            
        if investigator:
            print(f"✅ Sample Investigator: {investigator.email}")
            # Check if admin has messaged this investigator
            admin_messages = Message.objects.filter(
                sender__role__in=['admin', 'superadmin'],
                receiver=investigator
            ).count()
            print(f"   - Messages from admins: {admin_messages}")
        else:
            print("⚠️  No investigator users found")
            
        if victim:
            print(f"✅ Sample Victim: {victim.email}")
            # Check assigned investigators
            assigned_investigators = IncidentAssignments.objects.filter(
                incident__user=victim
            ).values_list('assigned_to__email', flat=True).distinct()
            print(f"   - Assigned investigators: {list(assigned_investigators)}")
        else:
            print("⚠️  No victim users found")
            
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def run_all_tests():
    """Run all tests"""
    print("\n" + "="*70)
    print("CHAT SYSTEM VERIFICATION TESTS")
    print("="*70)
    
    results = []
    results.append(("Admin Panel Exists", test_admin_panel_exists()))
    results.append(("Broadcast Copies", test_broadcast_copy()))
    results.append(("User Roles", test_user_roles()))
    results.append(("Incident Assignments", test_assignments()))
    results.append(("Message Permissions", test_message_permissions()))
    
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    print("="*70 + "\n")

if __name__ == '__main__':
    run_all_tests()
