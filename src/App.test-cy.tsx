import App from './App';

describe('Memory', () => {
  beforeEach(() => {
    cy.mount(<App />);
  });

  it('should render the initial state correctly', () => {
    cy.get('h1').should('have.text', 'Memory');
    cy.get('.tile').should('have.length', 8);
    cy.get('.tile.red').should('not.exist');
    cy.get('.tile.green').should('not.exist');
    cy.get('.tile.blue').should('not.exist');
    cy.get('.tile.yellow').should('not.exist');
    cy.get('button').should('have.text', 'Reset');
  });

  it('should flip a tile when clicked', () => {
    cy.get('.tile').first().click();
    // After clicking, it should still have a 'tile' class and also a color class.
    cy.get('.tile')
      .first()
      .should('have.class', 'tile')
      .and(($tile: JQuery<HTMLDivElement>) => {
        const hasColorClass = ['red', 'green', 'blue', 'yellow'].some((color) =>
          $tile.hasClass(color),
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(hasColorClass).to.be.true;
      });
  });

  it('should flip back after a non-match', () => {
    // We click two tiles. If they don't match, they should flip back.
    // Since it's shuffled, they might match. But with 4 colors and 8 tiles,
    // we can try to find two different ones or just wait if they don't match.

    // To be sure we get a non-match, we can click one, see its color, then click others until we find a different one.
    // Or we can just click the first two and if they don't match, verify they flip back.
    // If they DO match, we try another pair.

    cy.get('.tile').eq(0).click();
    cy.get('.tile').eq(1).click();

    cy.get('.tile')
      .eq(0)
      .then(($t1: JQuery<HTMLDivElement>) => {
        cy.get('.tile')
          .eq(1)
          .then(($t2: JQuery<HTMLDivElement>) => {
            const c1 = ['red', 'green', 'blue', 'yellow'].find((c) =>
              $t1.hasClass(c),
            );
            const c2 = ['red', 'green', 'blue', 'yellow'].find((c) =>
              $t2.hasClass(c),
            );

            if (c1 !== c2) {
              // Non-match: they should flip back after 500ms
              cy.get('.tile.red, .tile.green, .tile.blue, .tile.yellow').should(
                'have.length',
                2,
              );
              cy.wait(600); // Wait for timeout in App.tsx (500ms)
              cy.get('.tile.red, .tile.green, .tile.blue, .tile.yellow').should(
                'have.length',
                0,
              );
            }
          });
      });
  });

  it('should keep matched tiles flipped', () => {
    const colorGroups: Record<string, number[]> = {};

    // Discover the first 2 tiles
    cy.get('.tile').eq(0).click();
    cy.get('.tile')
      .eq(0)
      .then(($el: JQuery<HTMLDivElement>) => {
        const color = ['red', 'green', 'blue', 'yellow'].find((c) =>
          $el.hasClass(c),
        )!;
        colorGroups[color] = [0];
      });

    cy.get('.tile').eq(1).click();
    cy.get('.tile')
      .eq(1)
      .then(($el: JQuery<HTMLDivElement>) => {
        const color = ['red', 'green', 'blue', 'yellow'].find((c) =>
          $el.hasClass(c),
        )!;
        if (!colorGroups[color]) colorGroups[color] = [];
        colorGroups[color].push(1);
      });

    cy.then(() => {
      const colors = Object.keys(colorGroups);
      if (colors.length === 1) {
        // It's a match!
        cy.get('.tile').eq(0).should('have.class', colors[0]);
        cy.get('.tile').eq(1).should('have.class', colors[0]);
      } else {
        // Not a match, they will flip back.
        cy.wait(600);
        // Let's just reset and try to find a pair systematically in a way that works.
        cy.contains('Reset').click();

        let color0: string;
        cy.get('.tile')
          .eq(0)
          .click()
          .then(($el: JQuery<HTMLDivElement>) => {
            color0 = ['red', 'green', 'blue', 'yellow'].find((c) =>
              $el.hasClass(c),
            )!;
          });

        // We need to find the match for tile 0
        // We'll click tiles one by one until we find the match
        for (let i = 1; i < 8; i++) {
          cy.then(() => {
            // If tile 0 is already matched (has class), we skip
            cy.get('.tile')
              .eq(0)
              .then(($t0: JQuery<HTMLDivElement>) => {
                if ($t0.hasClass(color0)) return;

                cy.get('.tile').eq(i).click();
                cy.get('.tile')
                  .eq(i)
                  .then(($ti: JQuery<HTMLDivElement>) => {
                    if ($ti.hasClass(color0)) {
                      // Match! They should stay flipped.
                      cy.get('.tile').eq(0).should('have.class', color0);
                      cy.get('.tile').eq(i).should('have.class', color0);
                    } else {
                      // No match, wait for flip back and re-click tile 0
                      cy.wait(600);
                      cy.get('.tile').eq(0).click();
                    }
                  });
              });
          });
        }
      }
    });
  });

  it('should win the game when all pairs are matched', () => {
    const colorGroups: Record<string, number[]> = {};

    // Discover all colors
    for (let i = 0; i < 8; i++) {
      cy.get('.tile').eq(i).click();
      cy.get('.tile')
        .eq(i)
        .then(($el: JQuery<HTMLDivElement>) => {
          const color = ['red', 'green', 'blue', 'yellow'].find((c) =>
            $el.hasClass(c),
          )!;
          if (!colorGroups[color]) colorGroups[color] = [];
          colorGroups[color].push(i);
        });

      // After every two clicks, we MUST wait if they don't match, or they will flip back and interfere.
      // Actually, to be safe, let's just click one, record color, click it again (if it doesn't match)
      // Wait, clicking the same tile twice:
      // handleClick(index) in App.tsx:
      // if (selectedTiles.includes(index)) { setSelectedTiles(selectedTiles.filter((i) => i !== index)); return; }
      // So clicking it again unselects it. Perfect for discovery!
      cy.get('.tile').eq(i).click();
    }

    cy.then(() => {
      Object.values(colorGroups).forEach((indices) => {
        cy.get('.tile').eq(indices[0]).click();
        cy.get('.tile').eq(indices[1]).click();
      });

      cy.get('h1').should('have.text', 'You Win!');
    });
  });

  it('should reset the game when Reset button is clicked', () => {
    cy.get('.tile').eq(0).click();
    cy.get('.tile')
      .eq(0)
      .should('have.class', 'tile')
      .and('satisfy', ($el: JQuery<HTMLElement>) => {
        return ['red', 'green', 'blue', 'yellow'].some((color) =>
          $el.hasClass(color),
        );
      });

    cy.contains('Reset').click();

    cy.get('.tile').should('have.length', 8);
    cy.get('.tile.red, .tile.green, .tile.blue, .tile.yellow').should(
      'not.exist',
    );
    cy.get('h1').should('have.text', 'Memory');
  });
});
