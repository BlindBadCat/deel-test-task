const profileHP = {
  id: 1,
  firstName: 'Harry',
  lastName: 'Potter',
  profession: 'Wizard',
  balance: 1150,
  type:'client'
};

const unPaidJobId = 2;
const paidJobId = 7;
const lowFundsUnpdaidJobId = 1;


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

          // This profile has only 1 unpaid job
          expect(body.length).to.eq(1);
        });  
  })

  it('jobs/:job_id/pay should return 400 if job is already paid', () => {
    cy
      .request({
        headers: {
          profile_id: profileHP.id,
        },
        method: 'POST',
        url: `jobs/${paidJobId}/pay`,
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.status).to.eq(400);
      });  
  })
  it('jobs/:job_id/pay should return 400 if users profile is not client', () => {
    cy
      .request({
        headers: {
          profile_id: profileHP.id,
        },
        method: 'POST',
        url: `jobs/${paidJobId}/pay`,
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.status).to.eq(400);
      });
  });

  it('jobs/:job_id/pay should return 400 can not pay bcs of low balance', () => {
    cy
      .request({
        headers: {
          profile_id: 4,
        },
        method: 'POST',
        url: `jobs/${5}/pay`,
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.status).to.eq(400);
      });
  });

  
  it('jobs/:job_id/pay should pay for the job if everything is OK | DB should be resseted after 1st run', () => {
    cy
      .request({
        headers: {
          profile_id: 1,
        },
        method: 'POST',
        url: `jobs/${1}/pay`,
        failOnStatusCode: false,
      })
      .should((res) => {
        console.log(res.status)
        expect(res.status).to.eq(200);
      });
  });
})