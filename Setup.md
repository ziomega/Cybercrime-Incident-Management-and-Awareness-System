### 2. Backend

#### Setup Steps

1. **Clone the repository:**
    ```powershell
    git clone https://github.com/SinlessRook/Cybercrime-Incident-Management-and-Awareness-System.git
    cd Cybercrime-Incident-Management-and-Awareness-System/backend
    ```

2. **Create and activate a Python virtual environment:**
    ```powershell
    python -m venv venv
    .\venv\Scripts\activate
    ```

3. **Install required dependencies:**
   ```powershell
    cd CIMAS
    ```

    ```powershell
    pip install -r requirements.txt
    ```

4. **Configure environment variables:**
    - Create a `.env` file in the backend directory with the following content:
      ```env
      DEBUG=True
      SECRET_KEY='django-insecure-&ge1nt%6k$ieo8l5*%a52=(@n3&!%rcnym_n7%af4al*68@=8d'

      # PostgreSQL local development environment variables
      DB_ENGINE=django.db.backends.postgresql
      DB_NAME=CIMAS
      DB_USER=postgres
      DB_PASSWORD=pass
      DB_HOST=localhost
      DB_PORT=5432
      ```
    - Ensure your Django settings are configured to read from this `.env` file.

5. **Apply database migrations:**
    ```powershell
    python manage.py migrate
    ```

6. **Create a superuser (for admin access):**
    ```powershell
    python manage.py createsuperuser
    ```

7. **Run the backend server:**
    ```powershell
    python manage.py runserver
    ```

