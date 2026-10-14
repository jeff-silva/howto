# CAPP - Badge Management (Agent Rules)

## Overview
CAPP is a system integrated with Odoo to manage the sale and issuance of customized badges for B2B customers.

## Technical Rules

### 1. Planned Architecture
1. **Customers (`res.partner`)**: Native Odoo model. Will receive a "Credit Balance" computed field for the payment system.
2. **Badge Templates (`capp.badge.template`)**: Badge templates for each customer. Will have a "Billing Type" field (Pre-paid or Post-paid).
3. **Template Attributes (`capp.badge.attribute`)**: Required fields for the template (Text, File, etc).
4. **Orders (Integration with `sale.order` and `sale.order.line`)**: We will use the native Sales module.
5. **Badge Values (`capp.badge.value`)**: EAV model that will bind the Sales Order Line (`sale.order.line`) with the filled badge attributes.
6. **Credit Ledger (`capp.credit.ledger`)**: Credit transaction history for full traceability (previous balance, debited/credited amount, final balance, and order reference).

### 2. Credit System Implementation
- **Computed Balance**: The balance field (`capp_credit_balance`), transaction history, and billing type belong to the customer (`res.partner`). It is a Computed Field (`Integer`) that automatically sums transactions from the Ledger.
- **Ledger Immutability**: The ledger (`capp.credit.ledger`) table in the UI must be strictly read-only (`readonly="1"`). Users cannot manually add, edit, or delete historical lines in the view.
- **Quick Credit Input**: To adjust credits, the user utilizes transient input fields (`capp_add_credit` and `capp_add_credit_desc`). On save, the system intercepts the `write` method on `res.partner`, clears the transient fields, and securely creates the ledger entry.
- **Pre-paid**: The order can only be confirmed if the customer has sufficient balance at the moment (Current Balance >= Order Quantity). Confirming the order creates a negative entry in the Ledger.
- **Post-paid**: The order can be created freely. Confirmation also creates a negative entry in the Ledger, allowing the customer's Computed Balance to become negative (debt).

### 3. Development Patterns
- **Custom Order Interface**: To prevent bad UX, we built a dedicated interface (`capp.badge.order`) inside the `capp` module.
- **1 Order = 1 Configuration**: A `capp.badge.order` represents a batch of identical badges. It has a `quantity` field. It does not mix different badge configurations.
- **EAV on the Order**: The values (`capp.badge.value`) are attached directly to the `capp.badge.order`. When `template_id` changes, an `@api.onchange` automatically creates the required `capp.badge.value` lines based on the template's attributes, so the user just fills them in.
- **Hybrid Approach**: The custom `capp.badge.order` acts as a proxy. The user easily fills in the dynamic fields there. Behind the scenes (on confirmation), it handles creating the native `sale.order` for billing and financial tracking.
- **Automated Product Generation**: To ensure a frictionless UX, `capp.badge.template` automatically creates and synchronizes a hidden `product.product` of type `service` upon creation/update. The user does not need to manually configure billing products for each template. If a legacy template lacks a product, the `capp.badge.order` confirm action acts as a fallback and generates it on the fly.
- Use `capp.` prefix for project models.
- Follow Odoo 20 development standards (e.g., `<list>` instead of `<tree>`).
- Do not reinvent the wheel: plug financial processes into native `sale` whenever possible.

### 4. Odoo 20 Gotchas & Kanban Debugging
- **Restart & Upgrade Command**: After changing any XML file, restarting the container is not enough. You must run the exact command below to force Odoo to reload the module's XML from disk:
  ```bash
  docker compose restart odoo-web && docker compose exec -T odoo-web odoo -u capp -d odoo --db_host=odoo-db --db_user=odoo --db_password=myodoo --stop-after-init
  ```
- **"Missing 'card' template" Error**: In Odoo 20, if a Kanban template (inside `<t t-name="card">` or `<templates>`) references a field (e.g. `t-if="record.capp_billing_type.raw_value"`) but you forget to explicitly declare `<field name="capp_billing_type"/>` at the root of the Kanban or Card view, the JS compiler will silently crash and throw a generic, misleading "Missing 'card' template" error. Always declare fields before templates.
- **group_expand Signature Changes**: In Odoo 20, the Python method for `group_expand` does not reliably receive the `order` parameter as a positional argument. Using `def _read_group_stage_ids(self, stages, domain, order)` will result in a `TypeError: missing 1 required positional argument: 'order'`. Always declare the signature defensively: `def _read_group_stage_ids(self, stages, domain=None, order=None, **kwargs):`.
- **Dynamic Kanban Columns via SearchPanel**: Odoo passes the `<searchpanel>` filter to the Kanban backend through the `domain` parameter in the `group_expand` method. By parsing this domain (e.g. looking for `department_id`), we can dynamically filter `capp.stage.search` so the Kanban columns adapt perfectly to the user's sidebar selection.

## Business Rules

### 1. Production Flow
- **Departments & Stages**: Badge production is divided into Departments (e.g., Lanyards, Badges). Each department has sequentially ordered Stages.
- **Kanban Filtering**: The Production screen uses a Kanban view with a `<searchpanel>` filtered by `department_id` (expanded and single select). It is prohibited to create orders (`create="0"`) directly from the Production screen.
- **Automatic Completion**: When a badge order is dragged to the final stage of its respective department, an override on the `write` method detects it and automatically transitions the order state to `done` (Finalizado).
