describe('Matérias-Primas - CRUD', () => {
  beforeEach(() => {
    cy.visit('/raw-materials')
  })

  it('exibe a página de matérias-primas', () => {
    cy.contains('h1', 'Matérias-Primas').should('be.visible')
    cy.contains('button', '+ Nova Matéria-Prima').should('be.visible')
  })

  it('abre e fecha o modal de cadastro', () => {
    cy.contains('button', '+ Nova Matéria-Prima').click()
    cy.contains('Nova Matéria-Prima').should('be.visible')
    cy.get('button.modal-close').click()
    cy.contains('Nova Matéria-Prima').should('not.exist')
  })

  it('cria uma nova matéria-prima', () => {
    const name = `Teste MP ${Date.now()}`
    cy.createRawMaterial(name, '50', 'kg')
    cy.contains(name).should('be.visible')
    cy.contains('50').should('be.visible')
    cy.contains('kg').should('be.visible')
  })

  it('edita uma matéria-prima existente', () => {
    const original = `MP Edit ${Date.now()}`
    const updated = `MP Editada ${Date.now()}`
    cy.createRawMaterial(original, '10', 'un')

    cy.contains('tr', original).contains('button', 'Editar').click()
    cy.get('input[placeholder="Nome"]').clear().type(updated)
    cy.contains('button', 'Salvar').click()

    cy.contains(updated).should('be.visible')
    cy.contains(original).should('not.exist')
  })

  it('exclui uma matéria-prima', () => {
    const name = `MP Excluir ${Date.now()}`
    cy.createRawMaterial(name, '5', 'L')

    cy.contains('tr', name).contains('button', 'Excluir').click()
    cy.contains(name).should('not.exist')
  })
})
