/**
 * Backend API Testing Script
 * Tests all Admin endpoints without Postman
 */

const BASE_URL = 'http://localhost:3000/api';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

class APITester {
  constructor() {
    this.testResults = [];
    this.adminToken = null;
    this.userId = null;
    this.sessionId = null;
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async makeRequest(method, endpoint, body = null, token = null) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json().catch(() => null);
      return {
        status: response.status,
        ok: response.ok,
        data,
      };
    } catch (error) {
      return {
        status: 0,
        ok: false,
        error: error.message,
      };
    }
  }

  recordTest(name, passed, details = '') {
    this.testResults.push({ name, passed, details });
    const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
    console.log(`  ${status} - ${name}`);
    if (details) {
      console.log(`    ${colors.yellow}→ ${details}${colors.reset}`);
    }
  }

  async testHealthCheck() {
    this.log('\n📋 Testing: Health Check', 'blue');
    const result = await this.makeRequest('GET', '/');
    this.recordTest('Health Check', result.ok, `Status: ${result.status}`);
    return result.ok;
  }

  async testAuth() {
    this.log('\n🔐 Testing: Authentication', 'blue');

    // Test Registration with student role
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    const registerData = {
      email: testEmail,
      password: testPassword,
      role: 'student', // Only student or mentor are allowed
    };

    let regResult = await this.makeRequest('POST', '/auth/register', registerData);
    
    if (!regResult.ok) {
      this.log(`  Registration error details: ${JSON.stringify(regResult.data)}`, 'yellow');
    }
    
    this.recordTest('Register User (student role)', regResult.ok, `Status: ${regResult.status}`);

    // Test Login
    const loginResult = await this.makeRequest('POST', '/auth/login', {
      email: testEmail,
      password: testPassword,
    });

    if (loginResult.ok && loginResult.data?.access_token) {
      this.studentToken = loginResult.data.access_token;
      this.userId = loginResult.data.user?.id;
      this.recordTest('Login as Student', true, `Token received, User ID: ${this.userId}`);
    } else {
      if (!loginResult.ok) {
        this.log(`  Login error details: ${JSON.stringify(loginResult.data)}`, 'yellow');
      }
      this.recordTest('Login as Student', false, `Status: ${loginResult.status}`);
    }

    // Return success even if student login failed - we'll test with student token limitations
    return regResult.ok && loginResult.ok;
  }

  async testUserManagement() {
    this.log('\n👥 Testing: User Management Endpoints', 'blue');

    // First, test that student cannot access admin endpoints
    if (this.studentToken) {
      let result = await this.makeRequest('GET', '/admin/users', null, this.studentToken);
      this.recordTest(
        'Student Access Denied (role-based)',
        result.status === 403,
        `Status: ${result.status} (Expected: 403)`,
      );
    }

    // Test with a fake admin token
    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZha2UgVG9rZW4ifQ.fake';
    let result = await this.makeRequest('GET', '/admin/users', null, fakeToken);
    this.recordTest('Invalid Token Rejection', result.status !== 200, `Status: ${result.status}`);
  }

  async testAuditEndpoints() {
    this.log('\n🔍 Testing: AI Audit Endpoints (Authorization)', 'blue');

    // Test that endpoints exist but require admin role
    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkZha2UgVG9rZW4ifQ.fake';

    let result = await this.makeRequest(
      'GET',
      '/admin/audit/logs/recent?limit=10',
      null,
      fakeToken,
    );
    this.recordTest(
      'GET /admin/audit/logs/recent (Invalid Token)',
      result.status === 401 || result.status === 403,
      `Status: ${result.status}`,
    );

    result = await this.makeRequest('GET', '/admin/audit/statistics', null, fakeToken);
    this.recordTest(
      'GET /admin/audit/statistics (Invalid Token)',
      result.status === 401 || result.status === 403,
      `Status: ${result.status}`,
    );

    result = await this.makeRequest(
      'GET',
      '/admin/audit/logs/by-status/SUCCESS',
      null,
      fakeToken,
    );
    this.recordTest(
      'GET /admin/audit/logs/by-status/:status (Invalid Token)',
      result.status === 401 || result.status === 403,
      `Status: ${result.status}`,
    );
  }

  async testErrorHandling() {
    this.log('\n⚠️  Testing: Error Handling', 'blue');

    // 1. Test without authentication
    let result = await this.makeRequest('GET', '/admin/users');
    this.recordTest(
      'Unauthorized Access (no token)',
      result.status === 401,
      `Status: ${result.status} (Expected: 401)`,
    );

    // 2. Test invalid endpoint
    result = await this.makeRequest('GET', '/admin/invalid-endpoint', null, this.studentToken);
    this.recordTest(
      'Invalid Endpoint',
      result.status === 404,
      `Status: ${result.status} (Expected: 404)`,
    );

    // 3. Test invalid user ID without admin access
    result = await this.makeRequest('GET', '/admin/users/invalid-id', null, this.studentToken);
    this.recordTest(
      'Forbidden: Student Cannot Access Admin Endpoints',
      result.status === 403,
      `Status: ${result.status} (Expected: 403)`,
    );
  }

  printSummary() {
    const total = this.testResults.length;
    const passed = this.testResults.filter((t) => t.passed).length;
    const failed = total - passed;

    this.log('\n' + '='.repeat(60), 'blue');
    this.log('TEST SUMMARY', 'blue');
    this.log('='.repeat(60), 'blue');
    this.log(`Total Tests: ${total}`);
    this.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    this.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    this.log(
      `Success Rate: ${((passed / total) * 100).toFixed(2)}%`,
      passed === total ? 'green' : failed > 0 ? 'red' : 'yellow',
    );
    this.log('='.repeat(60), 'blue');
  }

  async runAllTests() {
    this.log('🚀 Starting Backend API Tests', 'green');
    this.log(`Base URL: ${BASE_URL}`, 'yellow');
    this.log('='.repeat(60), 'blue');

    // Run tests in sequence
    const healthOk = await this.testHealthCheck();

    if (!healthOk) {
      this.log('\n❌ Server is not responding. Is it running on port 3000?', 'red');
      return;
    }

    const authOk = await this.testAuth();

    if (authOk) {
      await this.testUserManagement();
      await this.testAuditEndpoints();
    }

    await this.testErrorHandling();

    this.printSummary();
  }
}

// Run tests
const tester = new APITester();
tester.runAllTests().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
