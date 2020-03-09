app.use(express.static("./dist/ihsa-cours-manager"));


app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/ihsa-cours-manager/'});
});

app.listen(process.env.PORT || 8080);