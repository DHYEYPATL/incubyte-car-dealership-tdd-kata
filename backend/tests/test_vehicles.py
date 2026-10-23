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


def test_purchase_decreases_quantity(client, admin_headers, user_headers):
    """RED: Purchasing a vehicle should decrease quantity by 1."""
    # Admin adds a vehicle with quantity 5
    response = client.post(
        "/api/vehicles",
        json={"make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000.00, "quantity": 5},
        headers=admin_headers,
    )
    vehicle_id = response.json()["id"]

    # Normal user purchases it
    response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["quantity"] == 4


def test_purchase_out_of_stock_returns_400(client, admin_headers, user_headers):
    """RED: Purchasing a vehicle with quantity 0 should return 400."""
    # Admin adds a vehicle with quantity 0
    response = client.post(
        "/api/vehicles",
        json={"make": "Honda", "model": "Civic", "category": "Sedan", "price": 22000.00, "quantity": 0},
        headers=admin_headers,
    )
    vehicle_id = response.json()["id"]

    # Normal user tries to purchase
    response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=user_headers)
    assert response.status_code == 400


def test_purchase_nonexistent_vehicle_returns_404(client, user_headers):
    """RED: Purchasing a vehicle that doesn't exist should return 404."""
    response = client.post("/api/vehicles/9999/purchase", headers=user_headers)
    assert response.status_code == 404
