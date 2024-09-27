app.use(cors({
    origin: [
      "https://chixxers.tecklyne.com",
      "https://chixxer.tecklyne.com",
      "https://chixxer.digitalmenu-admin.tecklyne.com",
      "https://chixxer.digitalmenu.tecklyne.com",
      "https://digitalmenu-admin-demo.deshit-bd.com",
      "http://localhost:3004",
      "https://digitalmenu.discounthut-bd.com",
      "https://digitalmenu-user.discounthut-bd.com",
      "https://e-food.user.discounthut-bd.com"
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true  // Allow credentials (for cookies, etc.)
  }));


  const io = socketIO(server, {
    cors: {
      origin: [
        "https://chixxers.tecklyne.com",
        "https://chixxer.tecklyne.com",
        "https://chixxer.digitalmenu-admin.tecklyne.com",
        "https://chixxer.digitalmenu.tecklyne.com",
        "https://digitalmenu-admin-demo.deshit-bd.com",
        "http://localhost:3004",
        "https://digitalmenu.discounthut-bd.com",
        "https://digitalmenu-user.discounthut-bd.com",
        "https://e-food.user.discounthut-bd.com"
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      credentials: true  // Allow credentials like cookies to be passed
    }
  });