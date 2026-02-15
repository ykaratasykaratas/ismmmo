const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tokens = await prisma.deviceToken.findMany();
    console.log('Device Tokens:', tokens);

    if (tokens.length === 0) {
        console.log('No tokens found!');
    } else {
        console.log(`Found ${tokens.length} tokens.`);
    }
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
