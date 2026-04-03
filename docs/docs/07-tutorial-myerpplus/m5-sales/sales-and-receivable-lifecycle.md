---
title: Complete Sales and Receivable Lifecycle Tutorial
sidebar_position: 2
description: MyERPPlus sales operational flow from quotation to receivable settlement.
---

# Complete Sales and Receivable Lifecycle Tutorial

This tutorial covers the full operational sales flow, starting from customer quotation, product delivery, and ending with receivable recording and accounting journal impact inside MyERPPlus.

## Stage 1: Pre-Sales and Ordering

This stage captures the process before goods are shipped, including agreements and formal customer orders.

### 1. Sales Quotation (SQ)

**Function:** provide an initial quotation to a prospective customer.

**Detail:** contains offered products, specifications, prices, and discounts if applicable.

### 2. Sales Contract (SF)

**Function:** record a long-term sales agreement with a customer for larger committed quantities.

**Note:** SF tracks outstanding quantity or remaining quota that has not yet been pulled into an order.

### 3. Sales Order (SO)

**Function:** record the formal customer order, usually based on the customer's PO.

**How it works:** SO can pull data from SF. If SF is used, the outstanding quantity in SF is reduced by the amount ordered in SO. SO also records the planned delivery date.

## Stage 2: Incoming Cash Before Invoice

This stage records money entering the company bank account before the formal invoice is issued.

### 1. Incoming Payment (IP)

**Function:** record incoming cash movement from bank statements before the business purpose is fully identified.

**Purpose:** keep bank statement balances synchronized with the ledger in the system.

### 2. Advance Sales (AS)

Recorded when the purpose of the incoming payment has already been confirmed by the customer.

There are two types:

- **Advance Sales:** advance payment that already has a specific SO reference.
- **Deposit:** advance payment without an SO reference, stored as deposit balance for future invoice deduction.

## Stage 3: Goods Delivery

This stage handles the physical movement of goods from warehouse to customer.

### 1. Packing List (PL)

**Function:** record packing details such as pack number, form, and weight.

**Note:** this document is optional and does not yet affect stock or finance.

### 2. Delivery Order (DO)

**Function:** record goods leaving the warehouse for delivery.

**Stock effect:** stock in the source warehouse decreases, then stock in the in-transit warehouse increases.

### 3. Delivery Receipt (DR)

**Function:** record the status of goods after arriving at the customer location.

**Stock effect when accepted:** in-transit stock decreases, then customer warehouse stock increases.

**Stock effect when returned:** in-transit stock decreases, then stock moves back to the source warehouse.

## Stage 4: Invoicing and Receivable Settlement

This is the formal billing cycle and profit-recognition stage.

### 1. Proforma Invoice (PI)

**Function:** supporting document for the customer before the formal invoice is issued.

**Note:** PI is optional and does not affect accounting reports, COGS, or inventory movement.

### 2. Sales Invoice (SI)

**Function:** issue the formal invoice to the customer and determine receivable aging based on payment terms.

**Stock effect:** permanently reduces stock from the customer warehouse, or from the transit warehouse if it is directly issued from DO.

**Journal effect:** creates receivable, VAT, sales revenue, and COGS versus inventory impact.

### 3. Sales Return (SR)

**Function:** record returned goods after the invoice has been issued.

**Stock effect:** stock returns to the company warehouse.

**Journal effect:** receivable and sales accounts decrease, inventory increases, and COGS decreases.

### 4. Incoming Collection (IC)

**Function:** create a receivable collection document that calculates invoice total, advances, incoming payment, and returns.

**Note:** manual COA adjustment can also be added at this stage, for example additional discount.

### 5. Receivable Payment

**Function:** execute settlement by selecting which invoices are being paid and reducing them using available deposits or advances.

**Journal effect:** receivable decreases and cash or bank balance increases.

## Document Flow Summary

The most common operational order is:

1. `SQ`
2. `SF` if a contract exists
3. `SO`
4. `IP` and `AS` if there is an advance payment
5. `PL` if detailed packing is needed
6. `DO`
7. `DR`
8. `PI` if the customer requires it
9. `SI`
10. `SR` if there is a return
11. `IC`
12. `Receivable payment`

## M5 Data Analysis Focus

In the context of queries, schemas, and dashboards, the sales module is usually analyzed from these perspectives:

- outstanding orders per customer
- delivery status by document
- receivable aging
- invoice realization versus SO or DO
- returns and their impact on net sales
