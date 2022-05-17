describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user2 = {
      name: 'Robert J.Test',
      username: 'test',
      password: 'P4ss0rF41l'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Blog List')
  })

  it('bad login rejected', function() {
    cy.contains('log in').click()
    cy.get('#username').type('test')
    cy.get('#password').type('nonsense')
    cy.get('#login-button').click()

    cy.get('.error').should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('.header').should('not.contain', 'logged in')
  })

  it('good login processed', function() {
    cy.contains('log in').click()
    cy.get('#username').type('test')
    cy.get('#password').type('P4ss0rF41l')
    cy.get('#login-button').click()
    cy.get('.confirm')
      .should('contain', 'logged in')
      .and('have.css', 'color', 'rgb(0, 0, 255)')
      .and('have.css', 'border-style', 'solid')
    cy.get('.header')
      .should('contain', 'test')
      .and('contain','logged in')
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test', password: 'P4ss0rF41l' })
    })

    it('a new blog can be created', function() {
      cy.get('.toggle').should('contain', 'new blog').click()
      cy.get('#title').type('The Moon is Made of Cheese')
      cy.get('#url').type('http://cheese.moon.com')
      cy.get('#author').type('John Paul Cheese')
      cy.contains('save').click()
      cy.get('html').should('contain', 'The Moon is Made of Cheese')
    })

    describe('when several blogs exist', function () {
      beforeEach(function () {
        //cy.login({ username: 'test', password: 'P4ss0rF41l' })
        cy.createBlog({
          title: 'The Moon is Made of Cheese',
          url: 'http://www.cheese.com',
          author: 'John Paul Cheese',
          likes: 4
        })
        cy.createBlog({
          title: 'The Moon is Not Made of Cheese',
          url: 'http://no.cheese.net',
          author: 'John Paul Cheese Jr.',
          likes: 2
        })
        cy.createBlog({
          title: 'The Cheese is Not Made of Moon',
          url: 'http://www.moon.org',
          author: 'John Paul Cheese III',
          //likes: 0
        })
      })

      it('Blog likes can be incremented', function () {
        cy.get('.blog').eq(2)
          .should('contain', 'Not Made of Moon')
          .find('.view')
          .click()
        cy.get('html')
          .should('contain', 'Likes:')
          .and('contain', '0')
        cy.get('.like')
          .click()
        cy.get('html')
          .should('contain', 'Likes:')
          .and('contain', '1')
        cy.get('.blog').eq(2)
          .should('contain', 'Not Made of Moon')
          .find('.hide')
          .click()
        cy.get('html')
          .should('not.contain', 'Likes:')
      })

      it('A blog can be deleted', function () {
        cy.get('.blog').eq(1)
          .should('contain', 'Not Made of Cheese')
          .find('.delete')
          .click()
        cy.get('.confirm')
          .should('contain', 'Not Made of Cheese')
          .and('have.css', 'color', 'rgb(0, 0, 255)')
          .and('have.css', 'border-style', 'solid')
        cy.get('html')
          .should('not.contain', 'John Paul Cheese Jr.')
      })

      it('A blog cannot be deleted by someone else', function () {

        const user0 = {
          name: 'George W. Wilbur',
          username: 'mrwilbur',
          password: 'Ge0rge'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user0)

        cy.login({ username: 'mrwilbur', password: 'Ge0rge' })

        cy.get('html').should('not.contain', '.delete')

        //cy.request('DELETE', 'http://localhost:3003/api/blogs/', )

      })

      it('Blogs are sorted by number of likes', function () {

        cy.get('.blog').eq(0).should('contain', 'The Moon is Made of Cheese')
          .find('.view')
          .click()
          .wait(1000)
        cy.get('.blog').eq(1).should('contain', 'The Moon is Not Made of Cheese')
          .find('.view')
          .click()
          .wait(1000)
        cy.get('.blog').eq(2).should('contain', 'The Cheese is Not Made of Moon')
          .find('.view')
          .click()
          .wait(1000)

        cy.get('.blog').eq(2).should('contain', 'The Cheese is Not Made of Moon')
          .find('.like')
          .click()
          .wait(1000)
          .click()
          .wait(1000)
          .click()
          .wait(1000)

        cy.get('.blog').eq(0).should('contain', 'The Moon is Made of Cheese')
        cy.get('.blog').eq(1).should('contain', 'The Cheese is Not Made of Moon')
        cy.get('.blog').eq(2).should('contain', 'The Moon is Not Made of Cheese')

        cy.get('.blog').eq(1).should('contain', 'The Cheese is Not Made of Moon')
          .find('.like')
          .click()
          .wait(1000)
          .click()
          .wait(1000)
          .click()
          .wait(1000)

        cy.get('.blog').eq(0).should('contain', 'The Cheese is Not Made of Moon')
        cy.get('.blog').eq(1).should('contain', 'The Moon is Made of Cheese')
        cy.get('.blog').eq(2).should('contain', 'The Moon is Not Made of Cheese')

      })
    })
  })
})