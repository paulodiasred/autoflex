// Comandos customizados globais do Cypress
Cypress.Commands.add('createRawMaterial', (name, stock, unit) => {
  cy.contains('button', '+ Nova Matéria-Prima').click()
  cy.get('input[placeholder="Nome"]').type(name)
  cy.get('input[placeholder="Ex: 100"]').type(stock)
  cy.get('input[placeholder="Ex: kg, L, un"]').type(unit)
  cy.contains('button', 'Salvar').click()
})

Cypress.Commands.add('createProduct', (name) => {
  cy.contains('button', '+ Novo Produto').click()
  cy.get('input[placeholder="Nome do produto"]').type(name)
  cy.contains('button', 'Salvar').click()
})
