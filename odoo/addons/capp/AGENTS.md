# CAPP - Badge Management (Agent Rules)

## Overview
CAPP is a system integrated with Odoo to manage the sale and issuance of customized badges for B2B customers.

## Planned Architecture
1. **Customers (`res.partner`)**: Native Odoo model. Will receive a "Credit Balance" computed field for the payment system.
2. **Badge Templates (`capp.badge.template`)**: Badge templates for each customer. Will have a "Billing Type" field (Pre-paid or Post-paid).
3. **Template Attributes (`capp.badge.attribute`)**: Required fields for the template (Text, File, etc).
4. **Orders (Integration with `sale.order` and `sale.order.line`)**: We will use the native Sales module.
5. **Badge Values (`capp.badge.value`)**: EAV model that will bind the Sales Order Line (`sale.order.line`) with the filled badge attributes.
6. **Credit Ledger (`capp.credit.ledger`)**: Credit transaction history for full traceability (previous balance, debited/credited amount, final balance, and order reference).

## Business Rules: Credit System
- **Computed Balance**: The balance field (`capp_credit_balance`), transaction history, and billing type belong to the customer (`res.partner`). It is a Computed Field (`Integer`) that automatically sums transactions from the Ledger.
- **Ledger Immutability**: The ledger (`capp.credit.ledger`) table in the UI must be strictly read-only (`readonly="1"`). Users cannot manually add, edit, or delete historical lines in the view.
- **Quick Credit Input**: To adjust credits, the user utilizes transient input fields (`capp_add_credit` and `capp_add_credit_desc`). On save, the system intercepts the `write` method on `res.partner`, clears the transient fields, and securely creates the ledger entry.
- **Pre-paid**: The order can only be confirmed if the customer has sufficient balance at the moment (Current Balance >= Order Quantity). Confirming the order creates a negative entry in the Ledger.
- **Post-paid**: The order can be created freely. Confirmation also creates a negative entry in the Ledger, allowing the customer's Computed Balance to become negative (debt).

## Development Rules
- **Custom Order Interface**: To prevent bad UX, we built a dedicated interface (`capp.badge.order`) inside the `capp` module.
- **1 Order = 1 Configuration**: A `capp.badge.order` represents a batch of identical badges. It has a `quantity` field. It does not mix different badge configurations.
- **EAV on the Order**: The values (`capp.badge.value`) are attached directly to the `capp.badge.order`. When `template_id` changes, an `@api.onchange` automatically creates the required `capp.badge.value` lines based on the template's attributes, so the user just fills them in.
- **Hybrid Approach**: The custom `capp.badge.order` acts as a proxy. The user easily fills in the dynamic fields there. Behind the scenes (on confirmation), it handles creating the native `sale.order` for billing and financial tracking.
- Use `capp.` prefix for project models.
- Follow Odoo 20 development standards (e.g., `<list>` instead of `<tree>`).
- Do not reinvent the wheel: plug financial processes into native `sale` whenever possible.
