describe('Routes: Index', () => {
    describe('GET /api', () => {
        it('Retorna o status da API', done => {
            request.get('/api')
                .expect(200)
                .end((err, res) => {
                    
                    const expected = { status: 'Financas pessoais API' };
                    expect(res.body).to.eql(expected);
                    done(err);
                });
        });
    });
});
