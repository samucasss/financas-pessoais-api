describe('Routes: Index', () => {
    describe('GET /', () => {
        it('Retorna o status da API', done => {
            request.get('/')
                .expect(200)
                .end((err, res) => {
                    
                    const expected = { status: 'Financas pessoais API' };
                    expect(res.body).to.eql(expected);
                    done(err);
                });
        });
    });
});
