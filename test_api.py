#!/usr/bin/env python3
"""
Test script for the Medical Diagnosis API
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_get_patients():
    """Test getting all patients"""
    print("Testing get patients...")
    response = requests.get(f"{BASE_URL}/patients")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Success: {data['success']}")
    print(f"Number of patients: {len(data['patients'])}")
    for patient in data['patients']:
        print(f"  - {patient['name']}: {patient['diagnosis']}")
    print()

def test_create_diagnosis():
    """Test creating a new diagnosis"""
    print("Testing create diagnosis...")
    
    # Test case 1: Normal appearance + normal eyes = No dehydration
    test_data = {
        "name": "Test Patient 1",
        "appearance": "1",
        "eyes": "1"
    }
    
    response = requests.post(f"{BASE_URL}/diagnosis", json=test_data)
    print(f"Test 1 - Status: {response.status_code}")
    data = response.json()
    print(f"Success: {data['success']}")
    if data['success']:
        print(f"Diagnosis: {data['patient']['diagnosis']}")
        print(f"Expected: No dehydration")
    print()
    
    # Test case 2: Irritable + slow skin pinch = Severe dehydration
    test_data = {
        "name": "Test Patient 2",
        "appearance": "2",
        "skin": "2"
    }
    
    response = requests.post(f"{BASE_URL}/diagnosis", json=test_data)
    print(f"Test 2 - Status: {response.status_code}")
    data = response.json()
    print(f"Success: {data['success']}")
    if data['success']:
        print(f"Diagnosis: {data['patient']['diagnosis']}")
        print(f"Expected: Severe dehydration")
    print()
    
    # Test case 3: Irritable + normal skin pinch = Some dehydration
    test_data = {
        "name": "Test Patient 3",
        "appearance": "2",
        "skin": "1"
    }
    
    response = requests.post(f"{BASE_URL}/diagnosis", json=test_data)
    print(f"Test 3 - Status: {response.status_code}")
    data = response.json()
    print(f"Success: {data['success']}")
    if data['success']:
        print(f"Diagnosis: {data['patient']['diagnosis']}")
        print(f"Expected: Some dehydration")
    print()

def test_error_cases():
    """Test error handling"""
    print("Testing error cases...")
    
    # Test missing name
    test_data = {
        "appearance": "1",
        "eyes": "1"
    }
    
    response = requests.post(f"{BASE_URL}/diagnosis", json=test_data)
    print(f"Missing name - Status: {response.status_code}")
    data = response.json()
    print(f"Success: {data['success']}")
    print(f"Error: {data.get('error', 'No error message')}")
    print()
    
    # Test missing follow-up question
    test_data = {
        "name": "Test Patient",
        "appearance": "1"
        # Missing eyes assessment
    }
    
    response = requests.post(f"{BASE_URL}/diagnosis", json=test_data)
    print(f"Missing follow-up - Status: {response.status_code}")
    data = response.json()
    print(f"Success: {data['success']}")
    print(f"Error: {data.get('error', 'No error message')}")
    print()

if __name__ == "__main__":
    print("Medical Diagnosis API Test Suite")
    print("=" * 40)
    
    try:
        test_health_check()
        test_get_patients()
        test_create_diagnosis()
        test_error_cases()
        
        print("All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API server.")
        print("Make sure the Flask server is running on http://localhost:5000")
    except Exception as e:
        print(f"Unexpected error: {e}")