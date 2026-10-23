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


def test_search_returns_matching_vehicles(client, admin_headers, user_headers):
    """RED: Search should return vehicles matching make or model (case-insensitive)."""
    # Add multiple vehicles
    client.post(
        "/api/vehicles",
        json={"make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000.00, "quantity": 5},
        headers=admin_headers,
    )
    client.post(
        "/api/vehicles",
        json={"make": "Toyota", "model": "Corolla", "category": "Sedan", "price": 20000.00, "quantity": 3},
        headers=admin_headers,
    )
    client.post(
        "/api/vehicles",
        json={"make": "Honda", "model": "Civic", "category": "Sedan", "price": 22000.00, "quantity": 4},
        headers=admin_headers,
    )

    # Search for "toyota" (lowercase, should match make)
    response = client.get("/api/vehicles?search=toyota", headers=user_headers)
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 2
    assert all(v["make"] == "Toyota" for v in results)

    # Search for "camry" (lowercase, should match model)
    response = client.get("/api/vehicles?search=camry", headers=user_headers)
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["model"] == "Camry"


def test_search_no_matches_returns_empty(client, admin_headers, user_headers):
    """RED: Search with no matches should return an empty list."""
    client.post(
        "/api/vehicles",
        json={"make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000.00, "quantity": 5},
        headers=admin_headers,
    )

    response = client.get("/api/vehicles?search=tesla", headers=user_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_search_requires_authentication(client):
    """RED: Search endpoint should require authentication."""
    response = client.get("/api/vehicles?search=toyota")
    assert response.status_code == 401
