/* eslint-disable no-use-before-define */
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import ts, { SourceFile } from 'typescript'

export interface DocsForFile {
  classes: ReturnType<typeof getDocsForClasses>
  enums: ReturnType<typeof getDocsForEnums>
  interfaces: ReturnType<typeof getDocsForInterfaces>
  types: ReturnType<typeof getDocsForTypes>
}

export const getDocsForFile = (filePath: string): DocsForFile => {
  const fileContent = readFileSync(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.ESNext,
    true
  )

  return {
    classes: getDocsForClasses(sourceFile),
    interfaces: getDocsForInterfaces(sourceFile),
    types: getDocsForTypes(sourceFile),
    enums: getDocsForEnums(sourceFile)
  }
}

export type DocsForDirectory = Map<string, DocsForFile>

export const getDocsForDirectory = (
  directoryPath: string
): DocsForDirectory => {
  const fileDocsMap = new Map<string, DocsForFile>()

  const traverseDirectory = (currentPath: string) => {
    const files = readdirSync(currentPath)

    files.forEach((file) => {
      const fullPath = join(currentPath, file)
      const stats = statSync(fullPath)

      if (stats.isDirectory()) {
        traverseDirectory(fullPath)
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const fileDocs = getDocsForFile(fullPath)
        fileDocsMap.set(fullPath, fileDocs)
      }
    })
  }

  traverseDirectory(directoryPath)

  return fileDocsMap
}

interface ClassMemberInfo {
  documentation: string
  isStatic: boolean
  kind: ts.SyntaxKind
  memberName: string
}

interface ClassInfo {
  className: string
  documentation: string
  members: ClassMemberInfo[]
  path: string
  tags: {
    name: string
  }[]
}

export const getDocsForClasses = (sourceFile: SourceFile) => {
  const classInfo: ClassInfo[] = []

  const visit = (node: ts.Node) => {
    if (ts.isClassDeclaration(node)) {
      const className = node.name ? node.name.escapedText : '<Anonymous>'
      const classDocs = ts
        .getJSDocCommentsAndTags(node)
        .map((comment) => comment.getText())
        .join('\n')

      const tags = [...ts.getJSDocTags(node)].map((tag) => ({
        name: tag.tagName.text
      }))

      classInfo.push({
        className: className.toString(),
        documentation: classDocs.trim(),
        path: sourceFile.fileName,
        tags,
        members: getDocsForClassMembers(node)
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return { info: classInfo }
}

export const getDocsForClassMembers = (
  classDeclaration: ts.ClassDeclaration
): ClassMemberInfo[] => {
  const membersInfo: ClassMemberInfo[] = []

  const visit = (node: ts.Node) => {
    if (ts.isConstructorDeclaration(node)) {
      membersInfo.push({
        memberName: 'constructor',
        documentation: ts
          .getJSDocCommentsAndTags(node)
          .map((comment) => comment.getText())
          .join('\n'),
        isStatic: false,
        kind: ts.SyntaxKind.Constructor
      })
    } else if (
      ts.isMethodDeclaration(node) ||
      ts.isGetAccessorDeclaration(node) ||
      ts.isSetAccessorDeclaration(node)
    ) {
      const memberName = node.name ? node.name.getText() : '<Unnamed>'
      const isStatic =
        node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword
        ) ?? false
      const kind = node.kind

      membersInfo.push({
        memberName,
        documentation: ts
          .getJSDocCommentsAndTags(node)
          .map((comment) => comment.getText())
          .join('\n'),
        isStatic,
        kind
      })
    } else if (ts.isPropertyDeclaration(node) || ts.isPropertySignature(node)) {
      const memberName = node.name ? node.name.getText() : '<Unnamed>'
      const isStatic =
        node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword
        ) ?? false
      const kind = node.kind

      membersInfo.push({
        memberName,
        documentation: ts
          .getJSDocCommentsAndTags(node)
          .map((comment) => comment.getText())
          .join('\n'),
        isStatic,
        kind
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(classDeclaration)

  return membersInfo
}

interface InterfaceMemberInfo {
  documentation: string
  memberName: string
}

export const getDocsForInterfaceMembers = (
  interfaceDeclaration: ts.InterfaceDeclaration
): InterfaceMemberInfo[] => {
  const interfaceMemberInfo: InterfaceMemberInfo[] = []

  interfaceDeclaration.members.forEach((member) => {
    const memberName = member.name ? member.name.getText() : '<Unnamed Member>'
    const memberDocs = ts
      .getJSDocCommentsAndTags(member)
      .map((comment) => comment.getText())
      .join('\n')

    interfaceMemberInfo.push({
      memberName,
      documentation: memberDocs.trim()
    })
  })

  return interfaceMemberInfo
}

interface InterfaceInfo {
  documentation: string
  interfaceName: string
  members: InterfaceMemberInfo[]
}

export const getDocsForInterfaces = (
  sourceFile: ts.SourceFile
): InterfaceInfo[] => {
  const interfaceInfo: InterfaceInfo[] = []

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node)) {
      const interfaceName = node.name ? node.name.getText() : '<Unnamed>'
      const interfaceDocs = ts
        .getJSDocCommentsAndTags(node)
        .map((comment) => comment.getText())
        .join('\n')

      interfaceInfo.push({
        interfaceName,
        documentation: interfaceDocs.trim(),
        members: getDocsForInterfaceMembers(node)
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return interfaceInfo
}

interface TypeMemberInfo {
  documentation: string
  memberName: string
}

export const getDocsForTypeMembers = (
  typeAliasDeclaration: ts.TypeAliasDeclaration
): TypeMemberInfo[] => {
  const typeMemberInfo: TypeMemberInfo[] = []

  const visit = (node: ts.Node) => {
    if (ts.isPropertySignature(node) || ts.isMethodSignature(node)) {
      const memberName = node.name ? node.name.getText() : '<Unnamed Member>'
      const memberDocs = ts
        .getJSDocCommentsAndTags(node)
        .map((comment) => comment.getText())
        .join('\n')

      typeMemberInfo.push({
        memberName,
        documentation: memberDocs.trim()
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(typeAliasDeclaration)

  return typeMemberInfo
}

interface TypeInfo {
  documentation: string
  members: TypeMemberInfo[]
  typeName: string
}

export const getDocsForTypes = (sourceFile: ts.SourceFile): TypeInfo[] => {
  const typeInfo: TypeInfo[] = []

  const visit = (node: ts.Node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      const typeName = node.name
        ? node.name.escapedText.toString()
        : '<Unnamed Type Alias>'
      const typeDocs = ts
        .getJSDocCommentsAndTags(node)
        .map((comment) => comment.getText())
        .join('\n')

      typeInfo.push({
        typeName,
        documentation: typeDocs.trim(),
        members: getDocsForTypeMembers(node)
      })
    } else {
      ts.forEachChild(node, visit)
    }
  }

  visit(sourceFile)

  return typeInfo
}

interface EnumMemberInfo {
  documentation: string
  memberName: string
}

export const getDocsForEnumMembers = (
  enumDeclaration: ts.EnumDeclaration
): EnumMemberInfo[] => {
  const enumMemberInfo: EnumMemberInfo[] = []

  enumDeclaration.members.forEach((member) => {
    const memberName = member.name ? member.name.getText() : '<Unnamed Member>'
    const memberDocs = ts
      .getJSDocCommentsAndTags(member)
      .map((comment) => comment.getText())
      .join('\n')

    enumMemberInfo.push({
      memberName,
      documentation: memberDocs.trim()
    })
  })

  return enumMemberInfo
}

interface EnumInfo {
  documentation: string
  enumName: string
  members: EnumMemberInfo[]
}

export const getDocsForEnums = (sourceFile: ts.SourceFile): EnumInfo[] => {
  const enumInfo: EnumInfo[] = []

  const visit = (node: ts.Node) => {
    if (ts.isEnumDeclaration(node)) {
      const enumName = node.name
        ? node.name.escapedText.toString()
        : '<Unnamed Enum>'
      const enumDocs = ts
        .getJSDocCommentsAndTags(node)
        .map((comment) => comment.getText())
        .join('\n')

      enumInfo.push({
        enumName,
        documentation: enumDocs.trim(),
        members: getDocsForEnumMembers(node)
      })
    } else {
      ts.forEachChild(node, visit)
    }
  }

  visit(sourceFile)

  return enumInfo
}
