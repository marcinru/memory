import App from './App';

describe('Memory', () => {
  it('should render without errors', () => {
    cy.mount(<App />);
  });
});
