const profileHP = {
  id: 1,
  firstName: 'Harry',
  lastName: 'Potter',
  profession: 'Wizard',
  balance: 1150,
  type:'client'
};


const requestConfigBase = {
  headers: {
    profile_id: profileHP.id,
  },
}

describe('balance endpoint', () => {
  it('/balances/deposit/:userId shoud not allow to deposit more then 25% of unpaid jobs', () => {
    cy
      .request({
        ...requestConfigBase,
        method: 'POST',
        url: `/balances/deposit/${profileHP.id}`,
        body: {
          amount: 9000,
        },
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.status).to.eq(400);
      });
  });
  it('/balances/deposit/:userId shoud not allow to deposit if there is no unpaid jobs', () => {
    cy
      .request({
        ...requestConfigBase,
        method: 'POST',
        url: `/balances/deposit/${3}`,
        body: {
          amount: 1,
        },
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.status).to.eq(400);
      });
  });
  it('/balances/deposit/:userId shoud add balance if everything is OK', () => {
    cy
      .request({
        headers: {
          profile_id: profileHP.id,
        },
        method: 'POST',
        url: `/balances/deposit/${profileHP.id}`,
        body: {
          amount: 10,
        },
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.status).to.eq(200);
      });
  });
})