def test_get_vehicles_empty(client, admin_headers):
    """RED: GET /api/vehicles with no vehicles should return an empty list."""
    response = client.get("/api/vehicles", headers=admin_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_admin_can_add_vehicle(client, admin_headers):
    """RED: Admin should be able to add a new vehicle."""
    vehicle_data = {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.00,
        "quantity": 5,
    }
    response = client.post("/api/vehicles", json=vehicle_data, headers=admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["category"] == "Sedan"
    assert data["price"] == 25000.00
    assert data["quantity"] == 5
    assert "id" in data


def test_non_admin_cannot_add_vehicle(client, user_headers):
    """RED: A non-admin user should get 403 when trying to add a vehicle."""
    vehicle_data = {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.00,
        "quantity": 5,
    }
    response = client.post("/api/vehicles", json=vehicle_data, headers=user_headers)
    assert response.status_code == 403
