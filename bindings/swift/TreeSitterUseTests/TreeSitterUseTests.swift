import XCTest
import SwiftTreeSitter
import TreeSitterUse

final class TreeSitterUseTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_use())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Use grammar")
    }
}
