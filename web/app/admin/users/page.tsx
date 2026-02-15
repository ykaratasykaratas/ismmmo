import { prisma } from '@/lib/prisma';
import UsersTable from './UsersTable';

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-ismmmo-navy mb-6">Üye Yönetimi</h1>
            <UsersTable initialUsers={users} />
        </div>
    );
}
