const profileHP = {
  id: 1,
  firstName: 'Harry',
  lastName: 'Potter',
  profession: 'Wizard',
  balance: 1150,
  type:'client'
};

const profileJS = {
  id: 5,
  firstName: 'John',
  lastName: 'Snow',
  profession: 'Knows nothing',
  balance: 451.3,
  type:'client'
};

const profileAT = {
  id: 7,
  firstName: 'Alan',
  lastName: 'Turing',
  profession: 'Programmer',
  balance: 22,
  type:'contractor'
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
        expect(res.body.id).to.eq(FirstContractIdHP);
      });
  });

  it('contracts/:id should return 404 if contract not found', () => {
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts/1000000000000000000000`,
        failOnStatusCode: false,
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
        url: `contracts/----`,
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.status).to.eq(422);
      });
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts/ssssss123123--=ssssssss`,
        failOnStatusCode: false
      })
      .should((res) => {
        expect(res.status).to.eq(422);
      });
  });

  // RN it will just return 404 if user have no access, I think it's better then to exec 2 queries to DB.
  // it('contracts/:id should return 403 if profile has no access to the contract', () => {
  //   cy
  //     .request({
  //       ...requestConfigBase,
  //       method: 'GET',
  //       url: `contracts/${FristContractIdJS}`,
  //     })
  //     .should((res) => {
  //       expect(res.status).to.eq(403);
  //     });
  // });

  
  it('contracts/ should return a list of profile contracts', () => {
    cy
      .request({
        ...requestConfigBase,
        method: 'GET',
        url: `contracts`,
        failOnStatusCode: false,
      })
      .should((res) => {
        const { body } = res;
        assert.isArray(body, 'val is array');

        const notOwnedContracts = body.filter(
          ({ ClientId, ContractorId }) => !(ClientId == profileHP.id || ContractorId == profileHP.id)
        );
        expect(notOwnedContracts.length).to.eq(0);
        // There is only one not terminated Contract in the DB
        expect(body.length).to.eq(1);
      });
  });

  it('contracts/ should return a list of profile contracts', () => {
    cy
      .request({
        headers: {
          profile_id: profileAT.id
        },
        method: 'GET',
        url: `contracts`,
        failOnStatusCode: false,
      })
      .should((res) => {
        const { body } = res;

        // This user has 3 not terminated contracts
        expect(body.length).to.eq(3);
      });
  });
})