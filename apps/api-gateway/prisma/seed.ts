// Task B0002: Database Setup & Migration
// This script seeds the database with initial roles, permissions, and a default admin user.

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create permissions
  const permissions = [
    { name: 'user:create', module: 'user', action: 'create', description: 'Create users' },
    { name: 'user:read', module: 'user', action: 'read', description: 'Read users' },
    { name: 'user:update', module: 'user', action: 'update', description: 'Update users' },
    { name: 'user:delete', module: 'user', action: 'delete', description: 'Delete users' },
    { name: 'role:manage', module: 'role', action: 'manage', description: 'Manage roles' },
    {
      name: 'department:manage',
      module: 'department',
      action: 'manage',
      description: 'Manage departments',
    },
    { name: 'audit:view', module: 'audit', action: 'view', description: 'View audit logs' },
  ];

  for (const permData of permissions) {
    await prisma.permission.upsert({
      where: { name: permData.name },
      update: {},
      create: permData,
    });
  }

  // 2. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'System Administrator', isSystem: true },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: { name: 'manager', description: 'Department Manager', isSystem: false },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', description: 'Regular User', isSystem: true },
  });

  // 3. Assign Permissions (Admin gets all)
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.uuid, permissionId: permission.uuid } },
      update: {},
      create: { roleId: adminRole.uuid, permissionId: permission.uuid },
    });
  }

  // Manager gets read/update user & dept manage
  const managerPermissions = allPermissions.filter((p) =>
    ['user:read', 'user:update', 'department:manage'].includes(p.name),
  );
  for (const permission of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: managerRole.uuid, permissionId: permission.uuid } },
      update: {},
      create: { roleId: managerRole.uuid, permissionId: permission.uuid },
    });
  }

  // 4. Create Departments
  const rootDepartment = await prisma.department.upsert({
    where: { code: 'root' },
    update: {},
    create: { name: 'Headquarters', code: 'root', description: 'Global HQ' },
  });

  const engineeringDept = await prisma.department.upsert({
    where: { code: 'eng' },
    update: {},
    create: {
      name: 'Engineering',
      code: 'eng',
      description: 'Engineering & Tech',
      parentId: rootDepartment.uuid,
    },
  });

  const hrDept = await prisma.department.upsert({
    where: { code: 'hr' },
    update: {},
    create: {
      name: 'Human Resources',
      code: 'hr',
      description: 'HR & People',
      parentId: rootDepartment.uuid,
    },
  });

  // 5. Create Users
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash,
      fullName: 'System Administrator',
      isActive: true,
    },
  });

  // Manager Engineering
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager.eng@example.com' },
    update: {},
    create: {
      email: 'manager.eng@example.com',
      username: 'manager_eng',
      passwordHash,
      fullName: 'Engineering Manager',
      isActive: true,
    },
  });

  // Staff Engineering
  const staffEng = await prisma.user.upsert({
    where: { email: 'staff.eng@example.com' },
    update: {},
    create: {
      email: 'staff.eng@example.com',
      username: 'staff_eng',
      passwordHash,
      fullName: 'Engineering Staff',
      isActive: true,
    },
  });

  // Staff HR
  const staffHr = await prisma.user.upsert({
    where: { email: 'staff.hr@example.com' },
    update: {},
    create: {
      email: 'staff.hr@example.com',
      username: 'staff_hr',
      passwordHash,
      fullName: 'HR Staff',
      isActive: true,
    },
  });

  // 6. Assign Roles to Users
  const assignRole = async (userUuid: string, roleUuid: string) => {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: userUuid, roleId: roleUuid } },
      update: {},
      create: { userId: userUuid, roleId: roleUuid },
    });
  };

  await assignRole(adminUser.uuid, adminRole.uuid);
  await assignRole(managerUser.uuid, managerRole.uuid);
  await assignRole(staffEng.uuid, userRole.uuid);
  await assignRole(staffHr.uuid, userRole.uuid);

  // 7. Create Sidebar Menu
  const dashboardMenu = await prisma.menu.upsert({
    where: { key: 'dashboard' },
    update: {
      title: 'Dashboard',
      path: '/app',
      icon: 'LayoutGrid',
      type: 'ITEM',
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'dashboard',
      title: 'Dashboard',
      path: '/app',
      icon: 'LayoutGrid',
      type: 'ITEM',
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
  });

  const assignMenuToRole = async (roleUuid: string, menuUuid: string) => {
    await prisma.roleMenu.upsert({
      where: { roleId_menuId: { roleId: roleUuid, menuId: menuUuid } },
      update: { canView: true, deletedAt: null, deletedBy: null },
      create: { roleId: roleUuid, menuId: menuUuid, canView: true },
    });
  };

  await assignMenuToRole(adminRole.uuid, dashboardMenu.uuid);
  await assignMenuToRole(managerRole.uuid, dashboardMenu.uuid);
  await assignMenuToRole(userRole.uuid, dashboardMenu.uuid);

  // 8. Assign Departments
  const assignDept = async (userUuid: string, deptUuid: string) => {
    await prisma.userDepartment.upsert({
      where: { userId_departmentId: { userId: userUuid, departmentId: deptUuid } },
      update: {},
      create: { userId: userUuid, departmentId: deptUuid },
    });
  };

  await assignDept(adminUser.uuid, rootDepartment.uuid);
  await assignDept(managerUser.uuid, engineeringDept.uuid);
  await assignDept(staffEng.uuid, engineeringDept.uuid);
  await assignDept(staffHr.uuid, hrDept.uuid);

  // 9. Create Dummy Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.uuid,
      action: 'USER_LOGIN',
      entityType: 'AUTH',
      entityId: adminUser.uuid,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Dummy Seed)',
    },
  });

  console.log('Seeding completed.');
  console.log('------------------------------------------------');
  console.log('Admin:   admin@example.com       (Role: admin, Dept: HQ)');
  console.log('Manager: manager.eng@example.com (Role: manager, Dept: Engineering)');
  console.log('Staff 1: staff.eng@example.com   (Role: user, Dept: Engineering)');
  console.log('Staff 2: staff.hr@example.com    (Role: user, Dept: HR)');
  console.log('Password for all: Password123!');
  console.log('------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
