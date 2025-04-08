// Setup express & CORS
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

// CORS - Allow only frontend origin
app.use(cors({
  origin: ['https://video-meet-frontend-9573.onrender.com'],
  credentials: true
}));

// Handle OPTIONS preflight
app.options('*', cors());

// Manually set CORS headers (to ensure Render doesn't mess up)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://video-meet-frontend-9573.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/v1/users', route);

// Root
app.get('/', (req, res) => {
  res.send("Server is Started");
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
