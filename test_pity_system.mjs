// Test script for Pity System
import pg from 'pg';
const { Client } = pg;

const client = new Client({
    connectionString: process.env.PGURI
});

async function testPitySystem() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        const userId = 1; // Test user

        // Test 1: Check initial pity status
        console.log('📊 Test 1: Initial Pity Status');
        const initialStatus = await client.query(
            'SELECT consecutive_common_drops, pity_threshold FROM user_progression WHERE user_id = $1',
            [userId]
        );
        console.log('Initial status:', initialStatus.rows[0]);
        console.log('');

        // Test 2: Simulate 3 common drops
        console.log('📊 Test 2: Simulate 3 Common Drops');
        for (let i = 1; i <= 3; i++) {
            await client.query(
                'UPDATE user_progression SET consecutive_common_drops = consecutive_common_drops + 1 WHERE user_id = $1',
                [userId]
            );
            const status = await client.query(
                'SELECT consecutive_common_drops, pity_threshold FROM user_progression WHERE user_id = $1',
                [userId]
            );
            console.log(`After drop ${i}:`, status.rows[0]);
        }
        console.log('');

        // Test 3: Apply Purity bonus (lower threshold)
        console.log('📊 Test 3: Apply Purity Bonus (Purity = 40)');
        const purityValue = 40;
        const baseThreshold = 5;
        const reduction = Math.floor(purityValue / 20);
        const newThreshold = Math.max(1, baseThreshold - reduction);

        await client.query(
            'UPDATE user_progression SET pity_threshold = $1 WHERE user_id = $2',
            [newThreshold, userId]
        );

        const afterPurity = await client.query(
            'SELECT consecutive_common_drops, pity_threshold FROM user_progression WHERE user_id = $1',
            [userId]
        );
        console.log(`Purity ${purityValue} → Threshold reduced to:`, afterPurity.rows[0].pity_threshold);
        console.log('Current status:', afterPurity.rows[0]);
        console.log('');

        // Test 4: Check if pity should trigger
        console.log('📊 Test 4: Check Pity Trigger');
        const status = afterPurity.rows[0];
        const shouldTrigger = status.consecutive_common_drops >= status.pity_threshold;
        console.log(`Consecutive drops: ${status.consecutive_common_drops}`);
        console.log(`Threshold: ${status.pity_threshold}`);
        console.log(`Pity should trigger: ${shouldTrigger ? '✅ YES' : '❌ NO'}`);
        console.log('');

        // Test 5: Simulate rare drop (reset counter)
        console.log('📊 Test 5: Simulate Rare Drop (Reset Counter)');
        await client.query(
            'UPDATE user_progression SET consecutive_common_drops = 0 WHERE user_id = $1',
            [userId]
        );
        const afterReset = await client.query(
            'SELECT consecutive_common_drops, pity_threshold FROM user_progression WHERE user_id = $1',
            [userId]
        );
        console.log('After rare drop:', afterReset.rows[0]);
        console.log('');

        // Test 6: Test different Purity values
        console.log('📊 Test 6: Purity Stat Threshold Table');
        console.log('Purity | Threshold');
        console.log('-------|----------');
        for (let purity of [0, 20, 40, 60, 80, 100]) {
            const reduction = Math.floor(purity / 20);
            const threshold = Math.max(1, 5 - reduction);
            console.log(`${purity.toString().padStart(6)} | ${threshold}`);
        }
        console.log('');

        console.log('✅ All pity system tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

testPitySystem();
