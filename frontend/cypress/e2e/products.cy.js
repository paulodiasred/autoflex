describe('Produtos - CRUD e Associação de Materiais', () => {
  beforeEach(() => {
    cy.visit('/products')
  })

  it('exibe a página de produtos', () => {
    cy.contains('h1', 'Produtos').should('be.visible')
    cy.contains('button', '+ Novo Produto').should('be.visible')
  })

  it('abre e fecha o modal de cadastro', () => {
    cy.contains('button', '+ Novo Produto').click()
    cy.contains('Novo Produto').should('be.visible')
    cy.get('button.modal-close').click()
    cy.contains('Novo Produto').should('not.exist')
  })

  it('cria um novo produto', () => {
    const name = `Produto Teste ${Date.now()}`
    cy.createProduct(name)
    cy.contains(name).should('be.visible')
  })

  it('edita um produto existente', () => {
    const original = `Produto Edit ${Date.now()}`
    const updated = `Produto Editado ${Date.now()}`
    cy.createProduct(original)

    cy.contains('tr', original).contains('button', 'Editar').click()
    cy.get('input[placeholder="Nome do produto"]').clear().type(updated)
    cy.contains('button', 'Salvar').click()

    cy.contains(updated).should('be.visible')
    cy.contains(original).should('not.exist')
  })

  it('exclui um produto', () => {
    const name = `Produto Excluir ${Date.now()}`
    cy.createProduct(name)

    cy.contains('tr', name).contains('button', 'Excluir').click()
    cy.contains(name).should('not.exist')
  })

  it('abre o modal de materiais de um produto', () => {
    const name = `Produto Mat ${Date.now()}`
    cy.createProduct(name)

    cy.contains('tr', name).contains('button', 'Materiais').click()
    cy.contains(`Materiais — ${name}`).should('be.visible')
    cy.contains('Adicionar Matéria-Prima').should('be.visible')
  })
})
