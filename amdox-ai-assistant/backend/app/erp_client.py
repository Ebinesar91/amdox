import requests
from app.config import ERP_API_BASE_URL

class ERPApiClient:
    def __init__(self, base_url: str = ERP_API_BASE_URL):
        self.base_url = base_url

    def _get_headers(self, tenant_id: str) -> dict:
        return {
            "x-tenant-id": tenant_id or "default-tenant-uuid-001",
            "Content-Type": "application/json"
        }

    def get_accounts(self, tenant_id: str) -> list:
        try:
            url = f"{self.base_url}/finance/accounts"
            res = requests.get(url, headers=self._get_headers(tenant_id), timeout=5)
            return res.json() if res.status_code == 200 else []
        except Exception:
            return []

    def get_invoices(self, tenant_id: str) -> list:
        try:
            url = f"{self.base_url}/finance/invoices"
            res = requests.get(url, headers=self._get_headers(tenant_id), timeout=5)
            return res.json() if res.status_code == 200 else []
        except Exception:
            return []

    def get_employees(self, tenant_id: str) -> list:
        try:
            url = f"{self.base_url}/hr/employees"
            res = requests.get(url, headers=self._get_headers(tenant_id), timeout=5)
            return res.json() if res.status_code == 200 else []
        except Exception:
            return []

    def get_payroll(self, tenant_id: str) -> list:
        try:
            url = f"{self.base_url}/hr/payroll"
            res = requests.get(url, headers=self._get_headers(tenant_id), timeout=5)
            return res.json() if res.status_code == 200 else []
        except Exception:
            return []

    def get_vendors(self, tenant_id: str) -> list:
        try:
            url = f"{self.base_url}/scm/vendors"
            res = requests.get(url, headers=self._get_headers(tenant_id), timeout=5)
            return res.json() if res.status_code == 200 else []
        except Exception:
            return []

    def get_projects(self, tenant_id: str) -> list:
        try:
            url = f"{self.base_url}/projects"
            res = requests.get(url, headers=self._get_headers(tenant_id), timeout=5)
            return res.json() if res.status_code == 200 else []
        except Exception:
            return []
