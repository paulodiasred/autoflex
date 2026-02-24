describe('Capacidade de Produção', () => {
  beforeEach(() => {
    cy.visit('/capacity')
  })

  it('exibe a página de capacidade de produção', () => {
    cy.contains('h1', 'Capacidade de Produção').should('be.visible')
    cy.contains('button', '↺ Atualizar').should('be.visible')
  })

  it('exibe as colunas da tabela', () => {
    cy.get('.table').within(() => {
      cy.contains('th', 'ID').should('be.visible')
      cy.contains('th', 'Produto').should('be.visible')
      cy.contains('th', 'Quantidade Possível').should('be.visible')
      cy.contains('th', 'Status').should('be.visible')
    })
  })

  it('atualiza os dados ao clicar em Atualizar', () => {
    cy.contains('button', '↺ Atualizar').click()
    cy.get('.table tbody').should('exist')
  })

  it('exibe badge verde para produtos viáveis', () => {
    cy.get('.badge-green').first().should('be.visible')
  })

  it('exibe tooltip com detalhes ao passar o mouse no status', () => {
    cy.get('.badge-hoverable').first().trigger('mouseenter')
    cy.get('.tooltip-box').should('be.visible')
    cy.get('.tooltip-table').within(() => {
      cy.contains('th', 'Matéria-prima').should('be.visible')
      cy.contains('th', 'Necessário').should('be.visible')
      cy.contains('th', 'Disponível').should('be.visible')
    })
    cy.get('.badge-hoverable').first().trigger('mouseleave')
  })
})
