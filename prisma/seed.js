const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const existingCategories = await prisma.feeCategory.count()
  if (existingCategories === 0) {
    await prisma.feeCategory.createMany({
      data: [
        { value: 'Tuition', label: 'Tuition Fee', description: 'Standard academic tuition', sortOrder: 1 },
        { value: 'BusFee', label: 'Bus Fee', description: 'Transportation services', sortOrder: 2 },
        { value: 'Uniform', label: 'Uniform', description: 'School uniform & accessories', sortOrder: 3 },
        { value: 'Library', label: 'Library Fee', description: 'Library & learning resources', sortOrder: 4 },
        { value: 'Lab', label: 'Lab Fee', description: 'Science laboratory access', sortOrder: 5 },
        { value: 'Sports', label: 'Sports Fee', description: 'Sports & extracurricular', sortOrder: 6 },
        { value: 'Exam', label: 'Exam Fee', description: 'Examination & assessment', sortOrder: 7 },
        { value: 'Other', label: 'Other', description: 'Miscellaneous payments', sortOrder: 8 },
      ],
    })
    console.log('Default fee categories created')
  } else {
    console.log('Fee categories already exist')
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@limsacademy.edu'

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    const hash = await bcrypt.hash('admin123', 10)
    await prisma.user.create({
      data: {
        name: 'School Administrator',
        email: adminEmail,
        passwordHash: hash,
        phone: '+234 800 000 0000',
        role: 'ADMIN',
      },
    })
    console.log('Admin user created:')
    console.log(`  Email: ${adminEmail}`)
    console.log(`  Password: admin123`)
  } else {
    console.log('Admin user already exists')
  }

  const parentEmail = 'parent@test.com'
  const existingParent = await prisma.user.findUnique({ where: { email: parentEmail } })
  if (!existingParent) {
    const hash = await bcrypt.hash('parent123', 10)
    const parent = await prisma.user.create({
      data: {
        name: 'Test Parent',
        email: parentEmail,
        passwordHash: hash,
        phone: '+234 800 000 0001',
        role: 'PARENT',
      },
    })
    console.log('Test parent user created:')
    console.log(`  Email: ${parentEmail}`)
    console.log(`  Password: parent123`)

    const student = await prisma.student.create({
      data: {
        firstName: 'Chioma',
        lastName: 'Okonkwo',
        age: 10,
        grade: 'Grade 5',
      },
    })
    console.log(`  Student: ${student.firstName} ${student.lastName} (${student.grade})`)

    await prisma.parentStudent.create({
      data: {
        parentId: parent.id,
        studentId: student.id,
        relationship: 'Mother',
      },
    })

    await prisma.payment.createMany({
      data: [
        {
          invoiceNo: 'INV-001',
          studentId: student.id,
          parentId: parent.id,
          amount: 150000,
          paidAmount: 150000,
          description: 'Tuition Fee - First Term',
          status: 'Paid',
          paidAt: new Date(),
        },
        {
          invoiceNo: 'INV-002',
          studentId: student.id,
          parentId: parent.id,
          amount: 120000,
          paidAmount: 0,
          description: 'Tuition Fee - Second Term',
          status: 'Pending',
          dueDate: new Date('2026-09-01'),
        },
      ],
    })
    console.log('  Sample payments created')
  } else {
    console.log('Test parent user already exists')
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
