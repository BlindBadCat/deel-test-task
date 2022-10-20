const profileHP = {
  id: 1,
  firstName: 'Harry',
  lastName: 'Potter',
  profession: 'Wizard',
  balance: 1150,
  type:'client'
};

const JSProfile = {
  id: 5,
  firstName: 'John',
  lastName: 'Snow',
  profession: 'Knows nothing',
  balance: 451.3,
  type:'client'
};

const FirstContractIdHP = 1;
const FristContractIdJS = 3;

const requestConfigBase = {
  headers: {
    profile_id: profileHP.id,
  },
}

describe('contracts endpoint', () => {
  const baseUrl = Cypress.env('baseUrl');
  it('contracts/:id should return the contract which belongs to the profile', () => {
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts/${FirstContractIdHP}`,
      })
      .should((res) => {
        expect(res.status).to.eq(200);
      });
  });

  it('contracts/:id should return 404 if contract not found', () => {
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts/1000000000000000000000}`,
      })
      .should((res) => {
        expect(res.status).to.eq(404);
      });
  });

  
  it('contracts/:id should handle invalid id format', () => {
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts/----}`,
      })
      .should((res) => {
        expect(res.status).to.eq(400);
      });
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts/ssssssssssssss}`,
      })
      .should((res) => {
        expect(res.status).to.eq(400);
      });
      
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts/00000000}`,
      })
      .should((res) => {
        expect(res.status).to.eq(400);
      });
      
  });

  it('contracts/:id should return 403 if profile has no access to the contract', () => {
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts/${FristContractIdJS}`,
      })
      .should((res) => {
        expect(res.status).to.eq(403);
      });
  });
})