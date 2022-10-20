describe('admin endpoint', () => {
  it('admin/best-profession?start=<date>&end=<date> Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time', () => {
    cy
      .request({
        headers: {
          profile_id: 1,
        },
        method: 'GET',
        url: `/admin/best-profession?start=2020-08-15&end=2022-08-15`,
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.body.profession).to.eq('Programmer');
      });  
  })

  it('/admin/best-clients?start=<date>&end=<date>&limit=<integer> - returns the clients the paid the most for jobs in the query time period. limit query parameter should be', () => {
    cy
      .request({
        headers: {
          profile_id: 1,
        },
        method: 'GET',
        url: `/admin/best-clients?start=2020-08-15&end=2022-08-15&limit=4`,
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.body.length).to.eq(4);
      });  
  })

  it('/admin/best-clients?start=<date>&end=<date>&limit=<integer> - defalut limit = 2', () => {
    cy
      .request({
        headers: {
          profile_id: 1,
        },
        method: 'GET',
        url: `/admin/best-clients?start=2020-08-15&end=2022-08-15`,
        failOnStatusCode: false,
      })
      .should((res) => {
        console.log(res.body)
        expect(res.body.length).to.eq(2);
      });  
  })


  it('/admin/best-clients?start=<date>&end=<date>&limit=<integer> - correct data', () => {
    cy
      .request({
        headers: {
          profile_id: 1,
        },
        method: 'GET',
        url: `/admin/best-clients?start=2020-08-15&end=2022-08-15`,
        failOnStatusCode: false,
      })
      .should((res) => {
        expect(res.body[0].lastName).to.eq('Kethcum');
      });  
  })
})