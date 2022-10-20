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
})