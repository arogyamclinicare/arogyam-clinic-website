#!/usr/bin/env node

/**
 * Load Testing Script for Arogyam Clinic
 * Tests website performance under various load conditions
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

class LoadTester {
  constructor(targetUrl, options = {}) {
    this.targetUrl = targetUrl;
    this.options = {
      concurrentUsers: options.concurrentUsers || 10,
      requestsPerUser: options.requestsPerUser || 5,
      delayBetweenRequests: options.delayBetweenRequests || 1000,
      timeout: options.timeout || 10000,
      ...options
    };
    
    this.results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalResponseTime: 0,
      responseTimes: [],
      errors: [],
      startTime: null,
      endTime: null
    };
  }

  // Make a single HTTP request
  async makeRequest() {
    return new Promise((resolve, reject) => {
      const url = new URL(this.targetUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const startTime = Date.now();
      
      const req = client.request(url, {
        method: 'GET',
        timeout: this.options.timeout,
        headers: {
          'User-Agent': 'LoadTester/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      }, (res) => {
        const responseTime = Date.now() - startTime;
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            responseTime,
            headers: res.headers,
            dataLength: data.length
          });
        });
      });
      
      req.on('error', (error) => {
        const responseTime = Date.now() - startTime;
        reject({ error, responseTime });
      });
      
      req.on('timeout', () => {
        req.destroy();
        const responseTime = Date.now() - startTime;
        reject({ error: new Error('Request timeout'), responseTime });
      });
      
      req.end();
    });
  }

  // Simulate a single user
  async simulateUser(userId) {
    const userResults = [];
    
    for (let i = 0; i < this.options.requestsPerUser; i++) {
      try {
        const result = await this.makeRequest();
        userResults.push(result);
        
        // Add delay between requests
        if (i < this.options.requestsPerUser - 1) {
          await this.delay(this.options.delayBetweenRequests);
        }
      } catch (error) {
        userResults.push({ error: error.error.message, responseTime: error.responseTime });
      }
    }
    
    return userResults;
  }

  // Run the load test
  async run() {
    console.log(`🚀 Starting load test for: ${this.targetUrl}`);
    console.log(`👥 Concurrent users: ${this.options.concurrentUsers}`);
    console.log(`📝 Requests per user: ${this.options.requestsPerUser}`);
    console.log(`⏱️  Total requests: ${this.options.concurrentUsers * this.options.requestsPerUser}`);
    console.log('─'.repeat(60));
    
    this.results.startTime = Date.now();
    
    // Create user simulation promises
    const userPromises = [];
    for (let i = 0; i < this.options.concurrentUsers; i++) {
      userPromises.push(this.simulateUser(i + 1));
    }
    
    // Wait for all users to complete
    const allUserResults = await Promise.all(userPromises);
    
    // Process results
    allUserResults.forEach((userResult, userId) => {
      userResult.forEach((requestResult) => {
        this.results.totalRequests++;
        
        if (requestResult.error) {
          this.results.failedRequests++;
          this.results.errors.push({
            userId: userId + 1,
            error: requestResult.error
          });
        } else {
          this.results.successfulRequests++;
          this.results.totalResponseTime += requestResult.responseTime;
          this.results.responseTimes.push(requestResult.responseTime);
        }
      });
    });
    
    this.results.endTime = Date.now();
    
    return this.generateReport();
  }

  // Generate comprehensive test report
  generateReport() {
    const totalTime = this.results.endTime - this.results.startTime;
    const avgResponseTime = this.results.successfulRequests > 0 
      ? this.results.totalResponseTime / this.results.successfulRequests 
      : 0;
    
    const sortedResponseTimes = [...this.results.responseTimes].sort((a, b) => a - b);
    const p50 = sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.5)];
    const p95 = sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.95)];
    const p99 = sortedResponseTimes[Math.floor(sortedResponseTimes.length * 0.99)];
    
    const successRate = (this.results.successfulRequests / this.results.totalRequests) * 100;
    const requestsPerSecond = (this.results.totalRequests / (totalTime / 1000)).toFixed(2);
    
    const report = {
      summary: {
        targetUrl: this.targetUrl,
        totalRequests: this.results.totalRequests,
        successfulRequests: this.results.successfulRequests,
        failedRequests: this.results.failedRequests,
        successRate: `${successRate.toFixed(2)}%`,
        totalTime: `${(totalTime / 1000).toFixed(2)}s`,
        requestsPerSecond
      },
      performance: {
        averageResponseTime: `${avgResponseTime.toFixed(2)}ms`,
        medianResponseTime: `${p50 || 0}ms`,
        p95ResponseTime: `${p95 || 0}ms`,
        p99ResponseTime: `${p99 || 0}ms`,
        minResponseTime: `${Math.min(...this.results.responseTimes) || 0}ms`,
        maxResponseTime: `${Math.max(...this.results.responseTimes) || 0}ms`
      },
      load: {
        concurrentUsers: this.options.concurrentUsers,
        requestsPerUser: this.options.requestsPerUser,
        totalLoad: this.options.concurrentUsers * this.options.requestsPerUser
      },
      errors: this.results.errors.slice(0, 10) // Show first 10 errors
    };
    
    return report;
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Test scenarios
const testScenarios = [
  {
    name: 'Light Load Test',
    options: {
      concurrentUsers: 5,
      requestsPerUser: 3,
      delayBetweenRequests: 2000
    }
  },
  {
    name: 'Medium Load Test',
    options: {
      concurrentUsers: 15,
      requestsPerUser: 5,
      delayBetweenRequests: 1000
    }
  },
  {
    name: 'Heavy Load Test',
    options: {
      concurrentUsers: 30,
      requestsPerUser: 8,
      delayBetweenRequests: 500
    }
  },
  {
    name: 'Stress Test',
    options: {
      concurrentUsers: 50,
      requestsPerUser: 10,
      delayBetweenRequests: 200
    }
  }
];

// Main execution function
async function runLoadTests() {
  const targetUrl = process.argv[2] || 'http://localhost:3000';
  
  console.log('🧪 AROGYAM CLINIC LOAD TESTING SUITE');
  console.log('='.repeat(60));
  
  for (const scenario of testScenarios) {
    console.log(`\n📊 Running: ${scenario.name}`);
    console.log('─'.repeat(40));
    
    const tester = new LoadTester(targetUrl, scenario.options);
    
    try {
      const report = await tester.run();
      
      // Display results
      console.log('\n📈 RESULTS:');
      console.log(`   Success Rate: ${report.summary.successRate}`);
      console.log(`   Avg Response: ${report.performance.averageResponseTime}`);
      console.log(`   P95 Response: ${report.performance.p95ResponseTime}`);
      console.log(`   Requests/sec: ${report.summary.requestsPerSecond}`);
      console.log(`   Total Time: ${report.summary.totalTime}`);
      
      // Performance assessment
      const avgResponse = parseFloat(report.performance.averageResponseTime);
      let performanceGrade = 'A';
      
      if (avgResponse > 2000) performanceGrade = 'C';
      else if (avgResponse > 1000) performanceGrade = 'B';
      else if (avgResponse > 500) performanceGrade = 'A-';
      
      console.log(`   Performance Grade: ${performanceGrade}`);
      
      // Success rate assessment
      const successRate = parseFloat(report.summary.successRate);
      let reliabilityGrade = 'A';
      
      if (successRate < 95) reliabilityGrade = 'C';
      else if (successRate < 98) reliabilityGrade = 'B';
      else if (successRate < 99) reliabilityGrade = 'A-';
      
      console.log(`   Reliability Grade: ${reliabilityGrade}`);
      
    } catch (error) {
      console.error(`❌ Error in ${scenario.name}:`, error.message);
    }
    
    // Wait between scenarios
    if (scenario !== testScenarios[testScenarios.length - 1]) {
      console.log('\n⏳ Waiting 5 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('\n🎉 Load testing complete!');
  console.log('\n📋 RECOMMENDATIONS:');
  console.log('   • If all tests pass with A grades: Ready for production');
  console.log('   • If any test gets B grade: Consider optimization');
  console.log('   • If any test gets C grade: Requires optimization before production');
}

// Run if called directly
if (require.main === module) {
  runLoadTests().catch(console.error);
}

module.exports = { LoadTester, runLoadTests };
