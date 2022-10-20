const profileHP = {
  id: 1,
  firstName: 'Harry',
  lastName: 'Potter',
  profession: 'Wizard',
  balance: 1150,
  type:'client'
};


describe('jobs endpoint', () => {
  it('jobs/unpaid should return all unpaid jobs for a user (either a client or contractor), for active contracts only', () => {
      cy
        .request({
          headers: {
            profile_id: profileHP.id,
          },
          method: 'GET',
          url: `jobs/unpaid`,
          failOnStatusCode: false,
        })
        .should((res) => {
          const { body } = res;
          assert.isArray(body, 'val is array');
  
          // const notOwnedContracts = body.filter(
          //   ({ ClientId, ContractorId }) => !(ClientId == profileHP.id || ContractorId == profileHP.id)
          // );
          // There is only one not terminated Contract in the DB
          expect(body.length).to.eq(0);
        });
  
  })
})